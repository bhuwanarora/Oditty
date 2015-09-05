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
		debugger
		 output = clause.execute
		 output.each do |elem|
		 	FacebookBooksHelper.set_bookmark(elem["type"], user_id, book_id, elem["publish_time"])
		 	if elem["from_goodreads"] == 0
		 		FacebookBooksHelper.set_bookmark(FacebookBooksHelper::TypeFromFacebook, user_id, elem["id"], elem["publish_time"])
		 	end
		 end
	end
end