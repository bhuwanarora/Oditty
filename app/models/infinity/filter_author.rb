class Infinity::FilterAuthor < Infinity
	def initialize id
		@author = Author.new(id)
		@id = id
	end

	def match
		@author.match_books  
	end
end