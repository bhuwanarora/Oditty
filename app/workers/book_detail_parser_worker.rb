class BookDetailParserWorker
	include GenreList
	@queue = :genre_list
	def self.perform(id, href)
		GenreList.get_book_details(id, href)
	end
end