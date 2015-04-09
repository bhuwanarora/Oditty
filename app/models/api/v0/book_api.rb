module Api
	module V0
		class BookApi

			def self.create_thumb_request(params, user_id)
				BooksGraphHelper.create_thumb_request(params, user_id)
			end

			def self.bookmarked_books
				self.recommendations.map do |s|
					s['bookmark_status'] = 1
					s
				end
			end

			def self.get_feed book_id
				feeds = Book::Feed.new(book_id).get_feed.execute
				notifications = Notification.new(feeds).structure_feed
				notifications
			end

			def self.get_book(id)
				@neo = Neography::Rest.new
				clause = "MATCH (book:Book) WHERE ID(book)="+id.to_s+" RETURN book"
				book = @neo.execute_query(clause)["data"]
				book
			end

			def self.push_recommendations
				self.recommendations
			end

			# def self.get_timeline id
			# 	test_moments = [
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		}
			# 	]
			# 	info = {"moments" => test_moments}
			# end

			def self.get_popular_books(params, user_id)
				if params["q"].present?
					params = JSON.parse params["q"]
				end
				skip_count = (params.nil? || params["skip_count"].nil?) ? 0 : params["skip_count"]
				info = (User::Suggest::BookSuggestion.get_popular_books skip_count, user_id).execute
				info
			end


			def self.get_basic_book_details(id, user_id)
				book = Book.new(id).get_display_info
			end

			def self.get_book_details(id, user_id=nil)
				book = UsersBook.new(id, user_id).get_basic_details.execute[0]
				if user_id
					structured_labels = []
					if book["labels"]
						for label in book["labels"]
							if book["selected_labels"].include? label
								json = {"name" => label, "checked" => true}
							else
								json = {"name" => label, "checked" => false}
							end
							structured_labels.push json
						end
					end

					friends_who_have_read = []
					if book["friends_id"].present?
						book["friends_id"].each do |id, index|
							friends_who_have_read.push({:id => id, :thumb => book["friends_thumb"][index]})
						end
					end

				end
				# isbn = book["isbn"].split(",")[0]
				# image_url = "http://covers.openlibrary.org/b/isbn/"+isbn+"-S.jpg";
				# image_service_url = "http://54.187.28.104/api/v0/colors?image_url=#{image_url}"
				# color = Net::HTTP.get(URI.parse(image_service_url))
				# color = JSON.parse(color)["data"]

				if user_id
					book.merge!(:friends => friends_who_have_read)
				end
				book
			end

			# def self.recommendations(last_book, filters={}, session)
			# 	user_id = session[:user_id]
			# 	if filters["reset"]
			# 		# $redis.set 'book_ids', ""
			# 		session[:book_ids] = ""
			# 		puts "RESET TRUE".red.on_yellow.blink
			# 	end
			# 	# book_ids = ($redis.get 'book_ids').split(",")
			# 	book_ids = session[:book_ids].to_s.split(",")
				
			# 	# puts book_ids.sort
			# 	@neo = Neography::Rest.new
				
<<<<<<< HEAD
<<<<<<< HEAD
				results = []

				specific_list = filters["filter_id"].present?
				bookmark_list = filters["label_id"].present?
				trends = filters["trend_id"].present?

				if filters["other_filters"].present?
					book_name = filters["other_filters"]["title"]
					book_id = filters["other_filters"]["id"]
					if book_id.present?
						puts "get_books_by_id".green
						clause = self._get_books_by_id filters
					elsif book_name.present?
						puts "_get_all_book_for_title_query".green
						clause = self._get_all_book_for_title_query filters
					else
						puts "get_filtered_books".green
						clause = self._get_filtered_books(filters, last_book)
					end
				elsif trends
					unless last_book.present?
						last_book = Constants::BestBook
					end
					puts "get_trends".green
					clause = self._get_trends(filters["trend_id"])
				elsif bookmark_list
					unless last_book.present?
						last_book = Constants::BestBook
					end
					puts "get_bookmark_lists".green
					clause = self._get_bookmark_lists(filters["label_id"], user_id)
				elsif specific_list
					unless last_book.present?
						last_book = Constants::BestBook
					end
					puts "get_specific_lists".green
					clause = self._get_specific_lists(filters["filter_id"], user_id)
				else
					unless last_book.present?
						last_book = Constants::BestBook
					end
					puts "get_basic_recommendations".green
					clause = self._get_basic_recommendations(filters, last_book)
				end

				puts clause.green
				begin
					books = @neo.execute_query(clause)["data"]
				rescue Exception => e
					puts "ERROR "+e.to_s.blue.on_red.blink
					# $redis.set 'book_ids', ""
					session[:book_ids] = ""
					books = @neo.execute_query(clause)["data"]
				end
				# puts books.length.to_s.red.on_blue
				specific_lists = filters["filter_id"].present? || filters["trend_id"].present?
				unless specific_lists
					for book in books
						node_id = book[1].to_s
						book_sent = book_ids.include? node_id
						unless book_sent
							if book_ids.present?
								# book_ids = ($redis.get 'book_ids')+","+node_id
								book_ids = session[:book_ids].to_s+","+node_id
							else
								book_ids = node_id
							end
							session[:book_ids] = book_ids
							# $redis.set 'book_ids', book_ids
							results.push book
						end
					end
				else
					results = books
				end 
				results
				# books
			end

			def self.detailed_book id
				if id == "1"
					thumb = "assets/books/20.jpeg"
				elsif id == "2"
					thumb = "assets/books/15.jpeg"
				elsif id == "3"
					thumb = "assets/books/11.jpeg"
				elsif id == "4"
					thumb = "assets/books/13.jpeg"
				elsif id == "5"
					thumb = "assets/books/a2.jpeg"
				elsif id == "13"
					thumb = "assets/Siddhartha.jpg"
				end
				_test_book_info(id, thumb)
			end

			def self.tooltip
				info = {
					:id => 1,
					:recommended => 0
				}
			end

			private
			def self._get_trends trend_id
				clause = "MATCH (t:News)-[:RelatedBooks]->(b:Book) WHERE ID(t)="+trend_id.to_s+" RETURN b.isbn, ID(b), b.external_thumb LIMIt 15"
				clause
			end

			def self._get_bookmark_lists(filter_id, user_id)
				clause = "MATCH (l:Label), (u:User) WHERE ID(l)="+filter_id.to_s+" AND ID(u)="+user_id.to_s+" WITH u, l MATCH (u)-[:Labelled]->(l)-[:BookmarkedOn]->(z:BookmarkNode)-[:BookmarkAction]->(b:Book) WHERE z.user_id="+user_id.to_s+" RETURN b.isbn, ID(b), b.external_thumb"
				clause
			end

			def self._get_specific_lists(filter_id, user_id)
				clause = "MATCH (bg:BookGrid) WHERE ID(bg)="+filter_id.to_s+" WITH bg MATCH (bg)-[:RelatedBooks]->(b:Book) RETURN b.isbn, ID(b), b.external_thumb"
				clause
			end

			def self._get_basic_recommendations(filters, last_book)
				clause = "MATCH (book:Book) WHERE ID(book)="+last_book.to_s+" MATCH p=(book)-[:Next_book*..10]->(b) WITH last(nodes(p)) as b RETURN b.isbn, ID(b), b.external_thumb"
				clause
			end

			def self._get_books_by_id filters
				book_id = filters["other_filters"]["id"]
				clause = "MATCH(book:Book) WHERE ID(book)="+book_id.to_s+" RETURN book.isbn as isbn, ID(book), book.external_thumb"
				clause
			end

			def self._get_all_book_for_title_query filters
				book_title_query = filters["other_filters"]["title"].gsub(" ", "").gsub(":", "")
				puts "book_title_query "+book_title_query+" show_all ".green
				skip_count = filters["reset_count"]
				clause = "START book=node:node_auto_index(\"indexed_title:"+book_title_query.downcase+"*\") WITH book, toFloat(book.gr_rating) * toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) as weight RETURN book.isbn as isbn, ID(book), book.external_thumb ORDER BY weight DESC SKIP "+skip_count.to_s+" LIMIT 10"
				clause
			end

			def self._get_filtered_books(filters, last_book)
				where_clause = ""
				match_clause = ""
				skip_clause = ""
				book_ids = ($redis.get 'book_ids').split(",")
				random = Random.new.rand(1..100)
				read_time = filters["other_filters"][Constants::Time]
				only_read_time = filters["other_filters"].keys.length == 1 && read_time.present?

				if only_read_time
					if read_time == Constants::TinyRead
						last_book = Constants::BestTinyRead unless last_book.present?
						relation = Constants::TinyReadRelation
					elsif read_time == Constants::SmallRead
						last_book = Constants::BestSmallRead unless last_book.present?
						relation = Constants::SmallReadRelation
					elsif read_time == Constants::NormalRead
						last_book = Constants::BestNormalRead unless last_book.present?
						relation = Constants::NormalReadRelation
					elsif read_time == Constants::LongRead
						last_book = Constants::BestLongRead unless last_book.present?
						relation = Constants::LongReadRelation
					end
					init_match_clause = "MATCH (b:ActiveBook) WHERE ID(b)="+last_book.to_s+" "
					match_clause = "MATCH p=(b)-[:"+relation+"*..5]->(next_book) WITH last(nodes(p)) as book "
				else
					time_group = filters["other_filters"][Constants::Year].split("(")[0].gsub(" " , "").downcase rescue ""
					if time_group.present?
						case time_group
						when Constants::OldEnglishLiterature
							init_match_clause = "MATCH (book:OldEnglishLiterature) "
						when Constants::MiddleEnglishLiterature
							init_match_clause = "MATCH (book:MiddleEnglishLiterature) "
						when Constants::EnglishRenaissance
							init_match_clause = "MATCH (book:EnglishRenaissance) "
						when Constants::NeoClassicalPeriod
							init_match_clause = "MATCH (book:NeoClassicalPeriod) "
						when Constants::Romanticism
							init_match_clause = "MATCH (book:Romanticism) "
						when Constants::VictorianLiterature
							init_match_clause = "MATCH (book:VictorianLiterature) "
						when Constants::Modernism
							init_match_clause = "MATCH (book:Modernism) "
						when Constants::PostModernLiterature
							init_match_clause = "MATCH (book:PostModernLiterature) "
						when Constants::Contemporary
							init_match_clause = "MATCH (book:Contemporary) "
						end
					else
						init_match_clause = "MATCH (book:Book) "
					end
					# random_clause = "ID(book)%"+random.to_s+"=0 AND rand() > 0.3 "
					with_clause = "WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_rating) AS rating_weight "
					init_order_clause = " ORDER BY "
					base_order_clause = " rating_weight DESC, book.total_weight DESC, book.gr_rating DESC "
					limit_clause = " LIMIT 10 "

					unless filters["reset"]
						if filters["reset_count"]
							skip_clause = "SKIP "+(filters["reset_count"] * 10).to_s+" "
							puts "RESET "+filters["reset_count"].to_s+" FALSE".red.on_yellow.blink
						end
					end
				end

				return_clause = "RETURN book.isbn as isbn, ID(book) as id, book.external_thumb as external_thumb"
			# 	results = []

			# 	specific_list = filters["filter_id"].present?
			# 	bookmark_list = filters["label_id"].present?
			# 	trends = filters["trend_id"].present?

			# 	if filters["other_filters"].present?
			# 		book_name = filters["other_filters"]["title"]
			# 		book_id = filters["other_filters"]["id"]
			# 		if book_id.present?
			# 			puts "get_books_by_id".green
			# 			clause = self._get_books_by_id filters
			# 		elsif book_name.present?
			# 			puts "_get_all_book_for_title_query".green
			# 			clause = self._get_all_book_for_title_query filters
			# 		else
			# 			puts "get_filtered_books".green
			# 			clause = self._get_filtered_books(filters, last_book)
			# 		end
			# 	elsif trends
			# 		unless last_book.present?
			# 			last_book = Constants::BestBook
			# 		end
			# 		puts "get_trends".green
			# 		clause = self._get_trends(filters["trend_id"])
			# 	elsif bookmark_list
			# 		unless last_book.present?
			# 			last_book = Constants::BestBook
			# 		end
			# 		puts "get_bookmark_lists".green
			# 		clause = self._get_bookmark_lists(filters["label_id"], user_id)
			# 	elsif specific_list
			# 		unless last_book.present?
			# 			last_book = Constants::BestBook
			# 		end
			# 		puts "get_specific_lists".green
			# 		clause = self._get_specific_lists(filters["filter_id"], user_id)
			# 	else
			# 		unless last_book.present?
			# 			last_book = Constants::BestBook
			# 		end
			# 		puts "get_basic_recommendations".green
			# 		clause = self._get_basic_recommendations(filters, last_book)
			# 	end

			# 	puts clause.green
			# 	begin
			# 		books = @neo.execute_query(clause)["data"]
			# 	rescue Exception => e
			# 		puts "ERROR "+e.to_s.blue.on_red.blink
			# 		# $redis.set 'book_ids', ""
			# 		session[:book_ids] = ""
			# 		books = @neo.execute_query(clause)["data"]
			# 	end
			# 	# puts books.length.to_s.red.on_blue
			# 	specific_lists = filters["filter_id"].present? || filters["trend_id"].present?
			# 	unless specific_lists
			# 		for book in books
			# 			node_id = book[1].to_s
			# 			book_sent = book_ids.include? node_id
			# 			unless book_sent
			# 				if book_ids.present?
			# 					# book_ids = ($redis.get 'book_ids')+","+node_id
			# 					book_ids = session[:book_ids].to_s+","+node_id
			# 				else
			# 					book_ids = node_id
			# 				end
			# 				session[:book_ids] = book_ids
			# 				# $redis.set 'book_ids', book_ids
			# 				results.push book
			# 			end
			# 		end
			# 	else
			# 		results = books
			# 	end 
			# 	results
			# 	# books
			# end

			# def self.detailed_book id
			# 	if id == "1"
			# 		thumb = "assets/books/20.jpeg"
			# 	elsif id == "2"
			# 		thumb = "assets/books/15.jpeg"
			# 	elsif id == "3"
			# 		thumb = "assets/books/11.jpeg"
			# 	elsif id == "4"
			# 		thumb = "assets/books/13.jpeg"
			# 	elsif id == "5"
			# 		thumb = "assets/books/a2.jpeg"
			# 	elsif id == "13"
			# 		thumb = "assets/Siddhartha.jpg"
			# 	end
			# 	_test_book_info(id, thumb)
			# end

			# def self.tooltip
			# 	info = {
			# 		:id => 1,
			# 		:recommended => 0
			# 	}
			# end

			# private
			# def self._get_trends trend_id
			# 	clause = "MATCH (t:Trending)-[:RelatedBooks]->(b:Book) WHERE ID(t)="+trend_id.to_s+" RETURN b.isbn, ID(b), b.external_thumb LIMIt 15"
			# 	clause
			# end

			# def self._get_bookmark_lists(filter_id, user_id)
			# 	clause = "MATCH (l:Label), (u:User) WHERE ID(l)="+filter_id.to_s+" AND ID(u)="+user_id.to_s+" WITH u, l MATCH (u)-[:Labelled]->(l)-[:BookmarkedOn]->(z:BookmarkNode)-[:BookmarkAction]->(b:Book) WHERE z.user_id="+user_id.to_s+" RETURN b.isbn, ID(b), b.external_thumb"
			# 	clause
			# end

			# def self._get_specific_lists(filter_id, user_id)
			# 	clause = "MATCH (bg:BookGrid) WHERE ID(bg)="+filter_id.to_s+" WITH bg MATCH (bg)-[:RelatedBooks]->(b:Book) RETURN b.isbn, ID(b), b.external_thumb"
			# 	clause
			# end

			# def self._get_basic_recommendations(filters, last_book)
			# 	clause = "MATCH (book:Book) WHERE ID(book)="+last_book.to_s+" MATCH p=(book)-[:Next_book*..10]->(b) WITH last(nodes(p)) as b RETURN b.isbn, ID(b), b.external_thumb"
			# 	clause
			# end

			# def self._get_books_by_id filters
			# 	book_id = filters["other_filters"]["id"]
			# 	clause = "MATCH(book:Book) WHERE ID(book)="+book_id.to_s+" RETURN book.isbn as isbn, ID(book), book.external_thumb"
			# 	clause
			# end

			# def self._get_all_book_for_title_query filters
			# 	book_title_query = filters["other_filters"]["title"].gsub(" ", "").gsub(":", "")
			# 	puts "book_title_query "+book_title_query+" show_all ".green
			# 	skip_count = filters["reset_count"]
			# 	clause = "START book=node:node_auto_index(\"indexed_title:"+book_title_query.downcase+"*\") WITH book, toFloat(book.gr_rating) * toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) as weight RETURN book.isbn as isbn, ID(book), book.external_thumb ORDER BY weight DESC SKIP "+skip_count.to_s+" LIMIT 10"
			# 	clause
			# end

			# def self._get_filtered_books(filters, last_book)
			# 	where_clause = ""
			# 	match_clause = ""
			# 	skip_clause = ""
			# 	book_ids = ($redis.get 'book_ids').split(",")
			# 	random = Random.new.rand(1..100)
			# 	read_time = filters["other_filters"][Constants::Time]
			# 	only_read_time = filters["other_filters"].keys.length == 1 && read_time.present?

			# 	if only_read_time
			# 		if read_time == Constants::TinyRead
			# 			last_book = Constants::BestTinyRead unless last_book.present?
			# 			relation = Constants::TinyReadRelation
			# 		elsif read_time == Constants::SmallRead
			# 			last_book = Constants::BestSmallRead unless last_book.present?
			# 			relation = Constants::SmallReadRelation
			# 		elsif read_time == Constants::NormalRead
			# 			last_book = Constants::BestNormalRead unless last_book.present?
			# 			relation = Constants::NormalReadRelation
			# 		elsif read_time == Constants::LongRead
			# 			last_book = Constants::BestLongRead unless last_book.present?
			# 			relation = Constants::LongReadRelation
			# 		end
			# 		init_match_clause = "MATCH (b:ActiveBook) WHERE ID(b)="+last_book.to_s+" "
			# 		match_clause = "MATCH p=(b)-[:"+relation+"*..5]->(next_book) WITH last(nodes(p)) as book "
			# 	else
			# 		time_group = filters["other_filters"][Constants::Year].split("(")[0].gsub(" " , "").downcase rescue ""
			# 		if time_group.present?
			# 			case time_group
			# 			when Constants::OldEnglishLiterature
			# 				init_match_clause = "MATCH (book:OldEnglishLiterature) "
			# 			when Constants::MiddleEnglishLiterature
			# 				init_match_clause = "MATCH (book:MiddleEnglishLiterature) "
			# 			when Constants::EnglishRenaissance
			# 				init_match_clause = "MATCH (book:EnglishRenaissance) "
			# 			when Constants::NeoClassicalPeriod
			# 				init_match_clause = "MATCH (book:NeoClassicalPeriod) "
			# 			when Constants::Romanticism
			# 				init_match_clause = "MATCH (book:Romanticism) "
			# 			when Constants::VictorianLiterature
			# 				init_match_clause = "MATCH (book:VictorianLiterature) "
			# 			when Constants::Modernism
			# 				init_match_clause = "MATCH (book:Modernism) "
			# 			when Constants::PostModernLiterature
			# 				init_match_clause = "MATCH (book:PostModernLiterature) "
			# 			when Constants::Contemporary
			# 				init_match_clause = "MATCH (book:Contemporary) "
			# 			end
			# 		else
			# 			init_match_clause = "MATCH (book:Book) "
			# 		end
			# 		# random_clause = "ID(book)%"+random.to_s+"=0 AND rand() > 0.3 "
			# 		with_clause = "WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_rating) AS rating_weight "
			# 		init_order_clause = " ORDER BY "
			# 		base_order_clause = " rating_weight DESC, book.total_weight DESC, book.gr_rating DESC "
			# 		limit_clause = " LIMIT 10 "

			# 		unless filters["reset"]
			# 			if filters["reset_count"]
			# 				skip_clause = "SKIP "+(filters["reset_count"] * 10).to_s+" "
			# 				puts "RESET "+filters["reset_count"].to_s+" FALSE".red.on_yellow.blink
			# 			end
			# 		end
			# 	end

			# 	return_clause = "RETURN book.isbn as isbn, ID(book) as id, book.external_thumb as external_thumb"
<<<<<<< HEAD
>>>>>>> fbdad8455836579b2dbc02bbe7e9235337bafbd5
=======
>>>>>>> 042c9cf0c5b5d726c967b6a8696f4fe4b368352a
				
			# 	# distinct_clause = "ALL (id in "+book_ids.to_s+" WHERE toInt(id) <> ID(book)) "

			# 	if filters["other_filters"][Constants::Country].present?
			# 		where_clause = where_clause + ""
			# 		match_clause = match_clause + ""
			# 	end
				

			# 	if filters["other_filters"][Constants::Author].present?
			# 		author_id =  filters["other_filters"][Constants::Author]
			# 		match_clause = match_clause + ", (author:Author)-[:Wrote]->(book) "
			# 		next_Where_clause = " ID(author) = "+author_id.to_s+" "
			# 		if where_clause.present?
			# 			where_clause = where_clause + " AND" + next_Where_clause
			# 		else
			# 			where_clause = where_clause + next_Where_clause
			# 		end
			# 	end


			# 	if filters["other_filters"][Constants::Genre].present?
			# 		genre = filters["other_filters"][Constants::Genre]
			# 		match_clause = match_clause + ", (genre:StarGenre)-[r:Belongs_to]->(book) "
			# 		next_Where_clause = " ID(genre) = "+genre.to_s+" AND r.weight IS NOT NULL "
					
			# 		with_clause = with_clause + " ,r.weight as genre_weight " if with_clause.present?
			# 		base_order_clause = " genre_weight DESC, "+base_order_clause if base_order_clause.present?
			# 		if where_clause.present?
			# 			where_clause = where_clause + " AND"+next_Where_clause
			# 		else
			# 			where_clause = where_clause + next_Where_clause
			# 		end
			# 	end

			# 	if !only_read_time && filters["other_filters"][Constants::Time].present?
			# 		if read_time == Constants::TinyRead
			# 			next_Where_clause = " toInt(book.page_count) <= 50 "
			# 		elsif read_time == Constants::SmallRead
			# 			next_Where_clause = " toInt(book.page_count) > 50 AND toInt(book.page_count) <= 100 "
			# 		elsif read_time == Constants::NormalRead
			# 			next_Where_clause = " toInt(book.page_count) < 100 AND toInt(book.page_count) <= 250"
			# 		elsif read_time == Constants::LongRead
			# 			next_Where_clause = " toInt(book.page_count) > 250 "
			# 		end
					
			# 		if where_clause.present?
			# 			where_clause = where_clause + " AND"+next_Where_clause
			# 		else
			# 			where_clause = where_clause + next_Where_clause
			# 		end
			# 	end

			# 	puts init_match_clause.present?
			# 	puts where_clause.present?
			# 	puts match_clause.present?
				
			# 	#MATCH WHERE WITH RETURN ORDER SKIP LIMIT
			# 	order_clause = init_order_clause + base_order_clause 	if init_order_clause.present?
			# 	clause = init_match_clause				
			# 	clause = clause + match_clause 							if match_clause.present?
			# 	clause = clause + "WHERE book:ActiveBook AND "+where_clause 				if where_clause.present?
			# 	clause = clause + with_clause 							if with_clause.present?
			# 	clause = clause + return_clause 						if return_clause.present?
			# 	clause = clause + order_clause 							if order_clause.present?
			# 	clause = clause + skip_clause 							if skip_clause.present?
			# 	clause = clause + limit_clause 							if limit_clause.present?
			# 	clause
			# end
		end
	end
end