class NewsWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :news_worker

	def perform params
		NewsHelper.add_news params
	end
	
end