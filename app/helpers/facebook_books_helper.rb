module FacebookBooksHelper
	TypeFromFacebook 	= "from_facebok"
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
					end
				rescue Exception => e
					puts "ERROR   #{e}    FOR     #{book.to_s}".red
				end
			end
		end
	end

	def self.handle_gr_book data, user_id
		book = data["data"]["book"] 
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
		(Bookmark::Type::IntendingToRead.new(user_id, book_id).facebook_book.add.gsub("RETURN", "SET bookmark_node.created_at = " + publish_time + " RETURN ")).execute
	end

	def self.handle_from_facebook user_id, book_id, publish_time
		publish_time = Time.parse(publish_time).to_i.to_s rescue publish_time.to_s
		(Bookmark::Type::FromFacebook.new(user_id, book_id).facebook_book.add.gsub("RETURN", "SET bookmark_node.created_at = " + publish_time + " RETURN ")).execute
	end

	def self.handle_read user_id, book_id, publish_time
		publish_time = Time.parse(publish_time).to_i.to_s rescue publish_time.to_s
		(Bookmark::Type::Read.new(user_id, book_id).facebook_book.add.gsub("RETURN", "SET bookmark_node.created_at = " + publish_time + " RETURN ")).execute
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
		fields = ["books.reads", "books", "books.wants_to_read"]
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
					id_list += response["data"][0..(new_books_count - 1)].map{|book| (book["data"]["book"]["id"].to_i)}
					url = FacebookBooksHelper.get_next_books_url response
				end
			end
		end
		id_list
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

	def self.handle_progress_in_reading_journey
		# ReadingJourney.create_progress
	end

# 	def self.test_
# 		json_str = '{
#   "data": [
#     {
#       "application": {
#         "name": "Books", 
#         "id": "174275722710475"
#       }, 
#       "comments": {
#         "data": [
#         ], 
#         "can_comment": true, 
#         "comment_order": "chronological", 
#         "count": 0
#       }, 
#       "from": {
#         "id": "620275488072075", 
#         "name": "Prachi Jain"
#       }, 
#       "likes": {
#         "data": [
#         ], 
#         "can_like": true, 
#         "count": 0, 
#         "user_likes": false
#       }, 
#       "no_feed_story": false, 
#       "publish_time": "2014-11-21T20:17:59+0000", 
#       "start_time": "2014-11-21T20:17:59+0000", 
#       "type": "books.reads", 
#       "data": {
#         "book": {
#           "id": "106488369388190", 
#           "title": "Bhagavad-gita As It Is", 
#           "type": "books.book", 
#           "url": "https://www.facebook.com/BhagavadGeetaAsItIs"
#         }
#       }, 
#       "id": "568748093224815"
#     }, 
#     {
#       "application": {
#         "name": "Books", 
#         "id": "174275722710475"
#       }, 
#       "comments": {
#         "data": [
#         ], 
#         "can_comment": true, 
#         "comment_order": "chronological", 
#         "count": 0
#       }, 
#       "from": {
#         "id": "620275488072075", 
#         "name": "Prachi Jain"
#       }, 
#       "likes": {
#         "data": [
#         ], 
#         "can_like": true, 
#         "count": 0, 
#         "user_likes": false
#       }, 
#       "no_feed_story": false, 
#       "publish_time": "2014-11-21T20:17:55+0000", 
#       "start_time": "2014-11-21T20:17:55+0000", 
#       "type": "books.reads", 
#       "data": {
#         "book": {
#           "id": "171044192943170", 
#           "title": "Siddhartha de Herman Hesse", 
#           "type": "books.book", 
#           "url": "https://www.facebook.com/pages/Siddhartha-de-Herman-Hesse/171044192943170"
#         }
#       }, 
#       "id": "568748076558150"
#     }
#     ], 
#   "paging": {
#     "cursors": {
#       "before": "NTY4NzQ4MDkzMjI0ODE1", 
#       "after": "NDc1MTU4MzMyNTgzNzky"
#     }, 
#     "next": "https://graph.facebook.com/v2.3/620275488072075/books.reads?pretty=0&limit=25&after=NDc1MTU4MzMyNTgzNzky"
#   }
# }' 
# 	params = JSON.parse(json_str)
# 	self.handle_books(params,3565843)

# 	end
end