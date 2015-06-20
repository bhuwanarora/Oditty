class FacebookBooksWorker
	include FacebookBooksHelper

	@queue = :facebook_books
	def self.perform params, user_id
		FacebookBooksHelper.handle_books params, user_id	
	end
end