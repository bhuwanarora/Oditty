class IndexerWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :indexer
	def perform(response)
        Indexer.new(response).handle
	end
end