class Infinity::FilterCategory < Infinity
	def initialize id
		@category = Category.new(id)
	end

	def match
		@category.match +  Author.match_path("author", "book", true) 
	end
end