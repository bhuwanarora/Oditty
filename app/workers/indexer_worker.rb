class IndexerWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :indexer
	def perform(response, type)
		if type == "Blog"
			base_url = "/api/v0/update_blog"
		elsif type == "News"
			base_url = "/api/v0/update_news"
		elsif type == "Author"
			base_url = "/api/v0/update_author"
		elsif type == "Book"
			base_url = "/api/v0/update_book"
		elsif type == "User"
			base_url = "/api/v0/update_user"
		elsif type == "Community"
			base_url = "/api/v0/update_community"
		end

		url = URI.parse(Rails.application.config.search_service_url + base_url)
		Net::HTTP.post_form(url, response)
	end
end