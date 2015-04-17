class Infinity::FilterReadTime < Infinity
	def initialize read_type_value
		@read_type_value = read_type_value
		case @read_type_value
		when Constant::Label::TinyReadValue
			@read_type = Constant::Label::TinyReadRelation
		when Constant::Label::SmallReadValue
			@read_type = Constant::Label::SmallReadRelation
		when Constant::Label::NormalReadValue
			@read_type = Constant::Label::NormalReadRelation
		when Constant::Label::LongReadValue
			@read_type = Constant::Label::LongReadRelation
		end
	end

	def match(book_label_defined, reading_time_id, skip_count)
		if book_label_defined
			clause = ReadTime.new(reading_time_id).match_books_after(skip_count, Limit)
		else
			clause = ReadTime.new(@reading_time_id).match_books
		end
		clause
	end
end