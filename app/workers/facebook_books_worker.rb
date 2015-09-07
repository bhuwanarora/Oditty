class FacebookBooksWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :facebook_books
	
	WorkAddFacebookBooks 	= 'WorkAddFacebookBooks'
	WorkAddBooksToBookMark 	= 'WorkAddBooksToBookMark'

	def perform params, user_id, work = WorkAddFacebookBooks
		case work
		when WorkAddFacebookBooks
			FacebookBooksWorker.add_fb_books params, user_id
		when WorkAddBooksToBookMark
			FacebookBooksWorker.bookmark params["book_id"]
		end
	end

	def self.add_fb_books params, user_id
		FacebookBooksHelper.handle_books params, user_id	
		clause = User.new(user_id).match + User.set_facebook_books_retrieval_time
		clause.execute
	end

	def self.bookmark book_id
		clause = Book.new(book_id).match + ReadingJourney.match_facebook_book +
		" WITH reading_journey, book, user " +
		" RETURN DISTINCT " +  ReadingJourney.bookmark_info
		 output = clause.execute
		 output.each do |elem|
		 	FacebookBooksHelper.set_bookmark(elem["type"], elem["user_id"], book_id, elem["publish_time"])
		 	if elem["from_goodreads"] == 0
		 		FacebookBooksHelper.set_bookmark(FacebookBooksHelper::TypeFromFacebook, elem["user_id"], elem["id"], elem["publish_time"])
		 	end
		 end
	end

# 	def self.test_add
# 		json_string = '{
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
#           "id": "163397093712421", 
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
#       "publish_time": "2014-11-21T20:17:49+0000", 
#       "start_time": "2014-11-21T20:17:49+0000", 
#       "type": "books.reads", 
#       "data": {
#         "book": {
#           "id": "10150470345482016", 
#           "title": "The Little Prince & Letter to a Hostage", 
#           "type": "good_reads:book", 
#           "url": "http://www.goodreads.com/book/show/3241368-the-little-prince-letter-to-a-hostage"
#         }
#       }, 
#       "id": "568748039891487"
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
#       "publish_time": "2014-11-21T20:17:47+0000", 
#       "start_time": "2014-11-21T20:17:47+0000", 
#       "type": "books.reads", 
#       "data": {
#         "book": {
#           "id": "106488369388190", 
#           "title": "Romeo and Juliet", 
#           "type": "good_reads:book", 
#           "url": "http://www.goodreads.com/book/show/18135.Romeo_and_Juliet"
#         }
#       }, 
#       "id": "568748029891488"
#     }], 
#   "paging": {
#     "cursors": {
#       "before": "NTY4NzQ4MDkzMjI0ODE1", 
#       "after": "NDc1MTU4MzMyNTgzNzky"
#     }, 
#     "next": "https://graph.facebook.com/v2.3/620275488072075/books.reads?pretty=0&limit=25&after=NDc1MTU4MzMyNTgzNzky"
#   }
# } '
# 	params = JSON.parse(json_string)
# 	output = FacebookBooksWorker.add_fb_books params, 3565843
# 	end
end