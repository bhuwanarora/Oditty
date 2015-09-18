class VersionerWorker
	require 'cgi'
	include Sidekiq::Worker
	sidekiq_options :queue => :versioner
	def perform(id, url, type)
		Sidekiq::Queue['versioner'].limit = 1
		Sidekiq::Queue['versioner'].process_limit = 1
		if id.present? && url.present? && type.present?
			type.downcase!
			case type
			when "user"
				url = "#{Rails.application.config.image_service}/api/v0/user_versions_update?id=#{id}&&bucket=#{Rails.application.config.user_bucket}&&url=#{CGI.escape(url)}"		
			when "news"
				url = "#{Rails.application.config.image_service}/api/v0/news_versions?id=#{id}&&bucket=#{Rails.application.config.news_bucket}&&url=#{CGI.escape(url)}"		
			when "community"
				url = "#{Rails.application.config.image_service}/api/v0/community_versions?id=#{id}&&bucket=#{Rails.application.config.community_bucket}&&url=#{CGI.escape(url)}"	
			end
			puts url.to_s
			output = JSON.parse(Net::HTTP.get(URI.parse(url)))
			puts output.to_s.green
		end
	end
end