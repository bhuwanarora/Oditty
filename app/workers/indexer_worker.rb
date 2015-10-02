class IndexerWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :indexer
	def perform(params_orig)
		params = params_orig.symbolize_keys
		type = params[:type]
		response = params[:response]
		base_url = "/api/v0/update?id=#{response}&type=#{type}"
		url = URI.parse(Rails.application.config.search_service_url + base_url)
		response = Net::HTTP.get(url)
		puts response.to_s.green
	end
end