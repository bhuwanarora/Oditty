class Infinity::FilterAuthor < Infinity
	def initialize id
		@author = Author.new(id)
	end

	def match
		@author.match + " WITH author, book" +  Author.match_path("author", "book", true) 
	end
end
