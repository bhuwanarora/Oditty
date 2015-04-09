class Bookmark::Type::IntendToRead < Bookmark::Type
	def initialize(user_id, book_id)
		@key = "IntendToRead"
		@name = "Intend to read"
		@user_id = user_id
		@book_id = book_id
		@bookmark = Bookmark.new(@user_id, @book_id, @key)
	end

end