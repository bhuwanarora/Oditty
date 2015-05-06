class Infinity::FilterCategory < Infinity
	def initialize id
		@category = Category.new(id)
		@id = id
	end

	def match
		@category.match_books 
	end

	def get_books skip_count, limit
		@category.match + Category.match_books_in_list("category", skip_count, limit) + Infinity::FilterCategory.return_group(Category.basic_info, Infinity::FilterCategory.collect_map({"books" => Book.grouped_basic_info}))   
	end
end