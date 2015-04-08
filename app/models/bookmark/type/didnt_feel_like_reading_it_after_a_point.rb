class Bookmark::Type::DidntFeelLikeReadingItAfterAPoint < Bookmark::Type
	def initialize(user_id, book_id)
		@key = "DidntFeelLikeReadingItAfterAPoint"
		@name = "Didn't feel like reading it after a point"
		@user_id = user_id
		@book_id = book_id
		@bookmark = Bookmark.new(@user_id, @book_id, @key)
	end
end