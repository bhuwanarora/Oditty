module FacebookBooksHelper
	TypeFromFacebook 	= "from_facebok"
	TypeWantsToRead		= "wants_to_read"
	TypeReads			= "reads"

	def self.handle_books params, user_id
		facebook_app_id = Constant::Id::FacebookAppId
		goodreads_app_id = Constant::Id::GoodreadsAppId
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
		(Bookmark::Type::IntendingToRead.new(user_id, book_id).facebook_book.add.gsub("RETURN", "SET bookmark_node.timestamp = " + publish_time + " RETURN ")).execute
	end

	def self.handle_from_facebook user_id, book_id, publish_time
		publish_time = Time.parse(publish_time).to_i.to_s rescue publish_time.to_s
		(Bookmark::Type::FromFacebook.new(user_id, book_id).facebook_book.add.gsub("RETURN", "SET bookmark_node.timestamp = " + publish_time + " RETURN ")).execute
	end

	def self.handle_read user_id, book_id, publish_time
		publish_time = Time.parse(publish_time).to_i.to_s rescue publish_time.to_s
		(Bookmark::Type::Read.new(user_id, book_id).facebook_book.add.gsub("RETURN", "SET bookmark_node.timestamp = " + publish_time + " RETURN ")).execute
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