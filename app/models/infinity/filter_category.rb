class Infinity::FilterCategory < Infinity
	def initialize id
		@category = Category.new(id)
		@id = id
	end

	def match(book_label_defined)
		if book_label_defined
			define_book_label_clause = ""
		else
			define_book_label_clause = " AND book :Book "
		end
		@category.get_books + define_book_label_clause + " "
	end
end