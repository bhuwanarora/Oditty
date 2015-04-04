class Bookmark::Type::Public < Bookmark::Type

	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def match
		UsersLabel.match + " WHERE label.public = true " + Bookmark::Type::Public.with_group("user", "labelled", "label") + Bookmark.optional_match_label("book") + Bookmark::Type::Public.with_group("bookmarked_on", "bookmark_node", "bookmark_action", "COLLECT("+Book.grouped_basic_info+") as books", "COUNT(book) AS books_count", "label")
	end

end