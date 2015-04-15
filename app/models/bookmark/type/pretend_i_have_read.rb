class Bookmark::Type::PretendIHaveRead < Bookmark::Type
	def initialize(user_id, book_id)
		@key = "PretendIHaveRead"
		@name = "Pretend I have read"
		@user_id = user_id
		@book_id = book_id
		@bookmark = Bookmark.new(@user_id, @book_id, @key).book
	end
end