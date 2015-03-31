class Infinity::FilterAuthor < Infinity
	def initialize id
		@author = Author.new(id)
		@id = id
	end

	def match(book_label_defined=false)
		if book_label_defined
			define_book_label_clause = ""
		else
			define_book_label_clause = " AND book :Book "
		end
		@author.books + define_book_label_clause + " " 
	end
end