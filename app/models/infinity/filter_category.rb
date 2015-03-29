class Infinity::FilterCategory < Infinity
	def initialize id
		@category = Category.new(id)
		@id = id
	end

	def match
		Category.match_path + " WHERE ID(category) = " + @id.to_s 
	end
end