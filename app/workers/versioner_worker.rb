class VersionerWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :versioner
	def perform(id, url, type)
		if id.present? && url.present? && tpye.present?
			type.downcase!
			case type
			when "user"
				url = "#{Rails.application.config.image_service}/api/v0/user_versions?id=#{id}&&bucket=rd-arjun&&url=#{url}}"		
			when "news"
				url = "#{Rails.application.config.image_service}/api/v0/news_versions?id=#{id}&&bucket=rd-arjun&&url=#{url}}"		
			when "community"
				url = "#{Rails.application.config.image_service}/api/v0/community_versions?id=#{id}&&bucket=rd-arjun&&url=#{url}}"		
			end
			JSON.parse(Net::HTTP.get(URI.parse(URI.encode(url))))
		end
	end
end