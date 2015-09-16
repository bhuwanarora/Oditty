module FacebookBooksHelper
	TypeFromGoodReads	= "from_goodreads"
	TypeFromFacebook 	= "from_facebook"
	TypeWantsToRead		= "wants_to_read"
	TypeReads			= "reads"

	def self.handle_books params, user_id
		facebook_app_id  = Constant::Id::FbAppFacebookBookId
		goodreads_app_id = Constant::Id::FbAppGoodreadsBookId
		books = params["data"]
		if books.present? 
			for data in books
				book = data["data"]["book"] 
				begin
					if data["application"]["id"].to_s == facebook_app_id.to_s
						book_id = FacebookBooksHelper.handle_facebook_book(data, user_id) 
					elsif data["application"]["id"].to_s == goodreads_app_id.to_s
						book_id = FacebookBooksHelper.handle_gr_book(data, user_id)
					else
						book_id = FacebookBooksHelper.handle_facebook_book(data, user_id)
					end
				rescue Exception => e
					puts "ERROR   #{e}    FOR     #{book.to_s}".red
				end
			end
		end
	end

	def self.handle_gr_book data, user_id
		book = data["data"]["book"]
		book["type"] = data["type"] 
		goodreads_id = book["id"]
		goodreads_title = book["title"]
		progress = data["data"]["progress"]
		reading_journey_info = (GoodreadsBook.merge_by_url(book) + ReadingJourney.link_reading_journey(user_id) + ReadingJourney.set_publish_time(Time.parse(data["publish_time"]).to_i) + ReadingJourney.set_start_time(Time.parse(data["start_time"]).to_i) + Book.return_group("COALESCE(recent_status.timestamp,0) AS timestamp, ID(reading_journey) AS id , ID(book) AS book_id")).execute[0]
		book_id = reading_journey_info['book_id']
		progress_link = ReadingJourney.create_progress(reading_journey_info, progress)
		if progress_link.present?
			progress_link.execute
		end
		book_id
	end

	def self.handle_facebook_book data, user_id
		book 			= data["data"]["book"]
		book["type"] 	= data["type"]
		facebook_id 	= book["id"]
		(FacebookBook.new(facebook_id).merge(book) + ReadingJourney.link_reading_journey(user_id) + ReadingJourney.set_publish_time(Time.parse(data["publish_time"]).to_i) + ReadingJourney.set_start_time(Time.parse(data["start_time"]).to_i) + Book.return_group(Book.basic_info)).execute[0]['book_id']
	end

	def self.get_author params
		author = params["written_by"]
		if author.nil?
			#goodreads book
			author = params["data"]["author"][0]["title"].strip rescue ""
			if !author.present?
				author = params["data"]["author"]["title"].strip rescue ""
			end
		end
		author
	end

	def self.set_bookmark type, user_id, book_id, publish_time
		case type 
		when TypeWantsToRead
			bookmark_clause = FacebookBooksHelper.handle_wants_to_reads(user_id, book_id, publish_time)
		when TypeReads
			bookmark_clause = FacebookBooksHelper.handle_read(user_id, book_id, publish_time)
		when TypeFromFacebook
			bookmark_clause = FacebookBooksHelper.handle_from_facebook(user_id, book_id, publish_time)
		end
	end

	def self.handle_wants_to_reads user_id, book_id, publish_time
		publish_time = Time.parse(publish_time).to_i.to_s rescue publish_time.to_s
		clause = Bookmark::Type::IntendingToRead.new(user_id, book_id).facebook_book.add
		clause = FacebookBooksHelper.replace_bookmark_created_time(publish_time, clause)
		clause.execute
	end

	def self.handle_from_facebook user_id, book_id, publish_time
		publish_time = Time.parse(publish_time).to_i.to_s rescue publish_time.to_s
		clause = Bookmark::Type::FromFacebook.new(user_id, book_id).facebook_book.add
		clause = FacebookBooksHelper.replace_bookmark_created_time(publish_time, clause)
		debugger
		clause.execute
	end

	def self.handle_read user_id, book_id, publish_time
		publish_time = Time.parse(publish_time).to_i.to_s rescue publish_time.to_s
		clause = Bookmark::Type::Read.new(user_id, book_id).facebook_book.add
		clause = FacebookBooksHelper.replace_bookmark_created_time(publish_time, clause)
		debugger
		clause.execute
	end

	def self.need_to_fetch latest_book_time, facebook_books_retrieval_time = 0
		FacebookLikesHelper.need_to_fetch(latest_book_time, facebook_books_retrieval_time)
	end

	def self.fetch user_fb_id
		clause = User::FacebookUser.new({'id' => user_fb_id}).get_latest_book
		output = clause.execute[0]
		user_id = output["user_id"]
		need_to_fetch_books = FacebookBooksHelper.need_to_fetch output["created_at"], output["facebook_books_retrieval_time"]
		if need_to_fetch_books
			new_fb_book_ids = FacebookBooksHelper.fetch_books_iterative(output["fb_id"], user_id, output["created_at"])
			FacebookBooksHelper.set_facebook_books_retrieval_time user_id
		else
			new_fb_book_ids = []
		end
		new_fb_book_ids
	end

	def self.fetch_backlog_books
		output = (User::FacebookUser.match + User::FacebookUser.return_group(User::FacebookUser.id_info)).execute
		output.each do |fb_user|
			user_id = fb_user["user_id"]
			fb_id = fb_user["fb_id"].to_i
			id_books = FacebookBooksHelper.fetch_books_iterative fb_id, user_id, 0
			id_books.each do |book_id|
				params_info = FacebookBooksHelper.get_info(fb_id, book_id)
				Api::V0::FacebookApi.map(params_info)
			end
		end
	end

	def self.fetch_books_iterative user_fb_id, user_id, stop_time
		fb_book_ids = []
		params =
		{
			:user_fb_id => user_fb_id,
			:user_id => user_id,
			:stop_time => stop_time
		}
		if stop_time.nil?
			params[:stop_time]=0
		end
		#fields = ["books.reads", "books", "books.wants_to_read"]
		fields = ["books.reads", "books.wants_to_read"]
		fields.each do |field|
			params[:url_field] = field
			fb_book_ids += FacebookBooksHelper.fetch_books_iterative_internal params
		end
		fb_book_ids
	end

	def self.fetch_books_iterative_internal params
		user_fb_id = params[:user_fb_id]
		user_id = params[:user_id]
		stop_time = params[:stop_time]
		url_field = params[:url_field]
		url = Rails.application.config.fb_graph_url + user_fb_id.to_s + "/#{url_field}?"
		access_token_string = "access_token=" + RedisHelper::Facebook.get_access_token({:id => user_fb_id}) rescue nil
		if access_token_string.nil?
			puts " Access token not present in redis  for user:#{user_id}!!".red
			id_list = []
		else
			url += access_token_string
			next_iteration = true
			id_list = []
			while next_iteration && url.present?
				response = JSON.parse(Net::HTTP.get(URI.parse(url)))
				FacebookBooksHelper.handle_books response, user_id
				new_books_count = FacebookBooksHelper.next_iteration_needed(response, stop_time)
				next_iteration = (new_books_count == response["data"].length) && new_books_count > 0
				if new_books_count > 0
					id_list += response["data"].map{|book| (book["data"]["book"]["id"].to_i)}
					url = FacebookBooksHelper.get_next_books_url response
				end
			end
		end
		id_list
	end

	def self.map_book_data
		name = params["name"]
		author = FacebookBooksHelper.get_author(params)
		facebook_id = params["id"]
		original_book_id = Book.get_by_unique_index("#{name.to_s.search_ready.strip}#{author.to_s.search_ready.strip}").execute[0]['book_id'] rescue ""
		if original_book_id.present?
			relations = FacebookBook.get_relations(facebook_id).execute[0]
			(FacebookBook.new(facebook_id).handle_relations(original_book_id, relations) + Book.set_facebook_book(facebook_id) + " WITH book AS facebook_book " +  FacebookBook.new(facebook_id).map(params) + " RETURN ID(facebook_book) AS id ").execute 
			bookmark_params = {"book_id" => original_book_id}
		else
			if author.present?
				output = (FacebookBook.new(facebook_id).match + FacebookBook.where_not_book + FacebookBook.new(facebook_id).map(params) + FacebookBook.set_book_label + " RETURN ID(facebook_book) AS id ").execute
				params_indexer = {:response => output[0]["id"], :type => "Book"}
				IndexerWorker.new.perform(params_indexer)
			else
				output = (FacebookBook.new(facebook_id).match + FacebookBook.where_not_book + FacebookBook.new(facebook_id).map(params) + " RETURN ID(facebook_book) AS id ").execute
			end
			bookmark_params = {"book_id" => output[0]["id"]}
		end
		if author.present?
			FacebookBooksWorker.new.perform(bookmark_params,nil, FacebookBooksWorker::WorkAddBooksToBookMark)
		end
	end

	def self.get_info user_fb_id, facebook_like_id
		FacebookLikesHelper.get_info user_fb_id, facebook_like_id
	end

	def self.set_facebook_books_retrieval_time user_id
		clause = User.new(user_id).match + User.set_facebook_books_retrieval_time
		clause.execute
	end

	def self.next_iteration_needed response, stop_time
		FacebookLikesHelper.next_iteration_needed response, stop_time, "publish_time"
	end

	def self.get_next_books_url response
		FacebookLikesHelper.get_next_likes_url response
	end

	def self.replace_bookmark_created_time created_at, clause
		output = clause.gsub(/SET bookmark_node.created_at = [0-9]*/, "SET bookmark_node.created_at = " + created_at.to_s + " ")
		output
	end
end