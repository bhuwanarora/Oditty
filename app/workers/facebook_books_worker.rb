class FacebookBooksWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :facebook_books
	
	WorkAddFacebookBooks 	= 'WorkAddFacebookBooks'
	WorkAddBooksToBookMark 	= 'WorkAddBooksToBookMark'
	WorkStartTheProcess 	= 'WorkStartTheProcess'

	def perform params, user_id, work = WorkAddFacebookBooks
		case work
		when WorkAddFacebookBooks
			FacebookBooksWorker.add_fb_books params, user_id
		when WorkAddBooksToBookMark
			FacebookBooksWorker.bookmark params["book_id"]
		when WorkStartTheProcess
			FacebookBooksWorker.start_process(params, user_id)
		end
	end

	def self.start_process params, user_id
		user_fb_id = params["fb_id"]
		id_books = FacebookBooksHelper.fetch user_fb_id
		books_added = false
		id_books.each do |book_id|
			begin
				params_info = FacebookBooksHelper.get_info(user_fb_id, book_id)
				Api::V0::FacebookApi.map(params_info)
				books_added = true
			rescue Exception => e
				puts e.to_s.red
			end
		end
		FeedHelper.create_user_feed(user_id) if books_added
	end

	def self.add_fb_books params, user_id
		FacebookBooksHelper.handle_books params, user_id	
	end

	def self.bookmark book_id
		clause = Book.new(book_id).match + ReadingJourney.match_facebook_book +
		" WITH reading_journey, book, user " +
		" RETURN DISTINCT " +  ReadingJourney.bookmark_info
		 output = clause.execute
		 output.each do |elem|
		 	FacebookBooksHelper.set_bookmark(elem["type"], elem["user_id"], book_id, elem["publish_time"])
		 	if elem["from_goodreads"] == 0
		 		FacebookBooksHelper.set_bookmark(FacebookBooksHelper::TypeFromFacebook, elem["user_id"], book_id, elem["publish_time"])
		 	end
		 end
	end
end