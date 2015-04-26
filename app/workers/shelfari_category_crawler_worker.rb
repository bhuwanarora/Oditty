class ShelfariCategoryCrawlerWorker
	# include ShelfariCrawler
	@queue = :category_crawler


	def self.perform(parent_id, name, url)
		ShelfariCrawler.add_category(parent_id, name, url)
	end
end