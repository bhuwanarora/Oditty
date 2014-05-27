class ShelfariAuthorCrawlerWorker
	include ShelfariCrawler
	@queue = :author_crawler_queue

	def self.perform(url, page_number)
		ShelfariCrawler.get_author_details(url, page_number)
	end
end