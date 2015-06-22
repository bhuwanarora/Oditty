class FacebookBooksWorker
	include FacebookBooksHelper

	@queue = :facebook_books
	def self.perform params, user_id
		facebook_books_retrieval_time = (User.new(user_id).match + User.return_group("user.facebook_books_retrieval_time AS time")).execute[0]['time'] rescue ""
		if !facebook_books_retrieval_time.present? || facebook_books_retrieval_time.to_i < (Time.now.to_i - 3600*24*30)
			FacebookBooksHelper.handle_books params, user_id	
			(User.new(user_id).match + User.set_facebook_books_retrieval_time).execute
		end
	end
end