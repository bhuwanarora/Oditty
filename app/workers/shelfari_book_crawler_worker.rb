class ShelfariBookCrawlerWorker
	include ShelfariCrawler
	@queue = :shelfari_book_crawler

	def self.perform(id, url)
		ShelfariCrawler.get_book_details(id, url)
	end
end