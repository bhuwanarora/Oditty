class ReupdateBooksWorker
	# include BooksHelper
	@queue = :reupdate_books

	def self.perform isbn_number
		puts "updating #{isbn_number}"
		BooksHelper.update_book isbn_number
	end

end