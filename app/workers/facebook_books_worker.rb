class FacebookBooksWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :facebook_books

	def perform params, user_id
		FacebookBooksHelper.handle_books params, user_id	
		clause = User.new(user_id).match + User.set_facebook_books_retrieval_time
		clause.execute
	end
end