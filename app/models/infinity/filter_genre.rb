class Infinity::FilterGenre < Infinity
	def initialize id
		@genre = Genre.new(id)
		@id = id
	end

	def match
		@genre.match_books 
	end

	def get_books skip_count, limit
		@genre.match + @genre.match_books + Infinity::FilterGenre.with_group("book") + Infinity::FilterGenre.skip(skip_count) + Infinity::FilterGenre.limit(10)
	end
end