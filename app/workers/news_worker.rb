class NewsWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :news_worker

	def perform params
		puts params.to_s
		NewsHelper.add_news params
	end
	
end