class Infinity::FilterEra < Infinity
	def initialize id
		@id = id
		@era = Era.new(id)
	end

	def match book_label_defined
		if book_label_defined
			clause = @era.match_books
		else
			clause = @era.init_match
		end
		clause
	end
end