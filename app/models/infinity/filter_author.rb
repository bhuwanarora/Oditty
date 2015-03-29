class Infinity::FilterAuthor < Infinity
	def initialize id
		@author = Author.new(id)
		@id = id
	end

	def match
		Author.match_path("author", "book", true) + " WHERE ID(author) = " + @id.to_s + " " 
	end
