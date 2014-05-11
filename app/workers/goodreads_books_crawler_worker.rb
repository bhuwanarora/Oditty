class GoodreadsBooksCrawlerWorker
	include GenreList
	@queue = :goodreads_books_list_queue

	def self.perform(page_number, genre_id, url)
		GenreList.parse_page(page_number, genre_id, url)
	end

end