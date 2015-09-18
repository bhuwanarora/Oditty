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
			begin
				output = JSON.parse(Net::HTTP.get(URI.parse(url)))
				puts output.to_s.green
			rescue Exception => e
				message = VersionerWorker.message(id, url, type)
				filename = VersionerWorker.log_file_name
				Elogger.log_info(message, log_file_name)
				puts e.to_s.red
			end
		end
	end

	def self.log_file_name
		"versioner_failed_tasks"
	end

	def self.message id, url, type
		" id:" + id.to_s + "url:" + url.to_s + " type:" + type.to_s + " "
	end
end