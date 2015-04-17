class Bookmark::Type::Public < Bookmark::Type

	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def match media="book"
		Bookmark.match_path(media) + " WHERE label.public = true WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, " + media + ", COUNT(label) AS label_count "
	end
end