class Infinity::FilterReadTime < Infinity
	def initialize read_type_value
		@read_type_value = read_type_value
		case @read_type_value
		when Constants::TinyReadValue
			@read_type = Constants::TinyReadRelation
		when Constants::SmallReadValue
			@read_type = Constants::SmallReadRelation
		when Constants::NormalReadValue
			@read_type = Constants::NormalReadRelation
		when Constants::LongReadValue
			@read_type = Constants::LongReadRelation
		end
	end

	def match(book_label_defined)
		if book_label_defined
			define_book_label_clause = ""
		else
			define_book_label_clause = " WHERE book :Book "
		end
		
	end
end