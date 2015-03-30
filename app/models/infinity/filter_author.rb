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
		Author.match_path("author", "book", author_label_defined=false) + " WHERE ID(author) = " + @id.to_s + define_book_label_clause + " " 
	end
end