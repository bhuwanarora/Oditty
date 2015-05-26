class Infinity::FilterCategory < Infinity
	def initialize id
		@category = Category.new(id)
		@id = id
	end

	def match
		@category.match_books 
	end

	def get_books skip_count, limit
		@category.match + Category.match_books_in_list("category", skip_count, limit)    
	end
end