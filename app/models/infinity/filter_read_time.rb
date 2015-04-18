class Infinity::FilterReadTime < Infinity
	def initialize read_type_value
		@read_type_value = read_type_value
		case @read_type_value
		when Constant::Id::TinyReadNode
			@read_type = Constant::Label::TinyReadRelation
		when Constant::Id::SmallReadNode
			@read_type = Constant::Label::SmallReadRelation
		when Constant::Id::NormalReadNode
			@read_type = Constant::Label::NormalReadRelation
		when Constant::Id::LongReadNode
			@read_type = Constant::Label::LongReadRelation
		end
	end

	def match(book_label_defined, skip_count)
		if book_label_defined
			clause = ReadTime.new(@read_type_value).match_books_after(skip_count, Limit)
		else
			clause = ReadTime.new(@read_type_value).match_books
		end
		clause
	end
end