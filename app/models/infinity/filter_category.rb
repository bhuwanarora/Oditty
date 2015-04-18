class Infinity::FilterCategory < Infinity
	def initialize id
		@category = Category.new(id)
		@id = id
	end

	def match(book_label_defined)
		if book_label_defined
			clause = @category.match_books.gsub(":Book","")
		else
			clause = @category.match_books 
		end
		clause
	end

	def get_books skip_count, limit
		@category.match + Category.match_books_in_list("category", skip_count, limit) + Infinity::FilterCategory.return_group(Category.basic_info, Infinity::FilterCategory.collect_map({"book" => Book.grouped_basic_info}))   
	end
end