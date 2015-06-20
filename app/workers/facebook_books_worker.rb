class FacebookBooksWorker
	include FacebookBooksHelper

	@queue = :facebook_books
	def self.perform params
		FacebookBooksHelper.handle_books params, user_id	
	end
end