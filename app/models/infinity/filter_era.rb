class Infinity::FilterEra < Infinity
	def initialize id
		@id = id
	end

	def match(book_label_defined)
		if book_label_defined
			define_book_label_clause = ""
		else
			define_book_label_clause = " AND book :Book "
		end
		Era.match_path + " WHERE ID(era) = " + @id.to_s + define_book_label_clause + " "
	end
end