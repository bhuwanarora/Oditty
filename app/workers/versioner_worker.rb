class VersionerWorker
	require 'cgi'
	include Sidekiq::Worker
	sidekiq_options :queue => :versioner
	def perform(id, url, type)
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
			JSON.parse(Net::HTTP.get(URI.parse(url)))
		end
	end
end