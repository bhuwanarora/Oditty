class Infinity::FilterEra < Infinity
	def initialize id
		@id = id
		@era = Era.new(id)
	end

	def match(book_label_defined)
		if book_label_defined
			define_book_label_clause = ""
		else
			define_book_label_clause = " AND book :Book "
		end
		@era.books + define_book_label_clause + " "
	end
end