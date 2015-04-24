class ShelfariBookListWorker
	# include ShelfariCrawler
	@queue = :book_list_queue

	def self.perform(url)
		ShelfariCrawler.get_list_of_books(url)
	end
end