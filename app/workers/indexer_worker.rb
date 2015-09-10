class IndexerWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :indexer
	def perform(params)
		type = params[:type]
		response = params[:response]
		if type == "Blog"
			base_url = "/api/v0/update"
		elsif type == "News"
			base_url = "/api/v0/update"
		elsif type == "Author"
			base_url = "/api/v0/update"
		elsif type == "Book"
			base_url = "/api/v0/update"
		elsif type == "User"
			base_url = "/api/v0/update"
		elsif type == "Community"
			base_url = "/api/v0/update"
		end
		base_url += "?id=#{response}&type=#{type}"
		url = URI.parse(Rails.application.config.search_service_url + base_url)
		response = Net::HTTP.get(url)
		puts response.to_s.green
	end
end