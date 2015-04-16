class Bookmark::Type::Visited < Bookmark::Type
	def initialize(user_id, media_id=nil)
		@name = "Visited"
		@key = "Visited"
		@user_id = user_id
		@media_id = media_id
		@bookmark = Bookmark.new(@user_id, @media_id, @key)
	end

	def match 
		@bookmark_node_media_label_class.match_path + " WHERE label.key = '"+@key+"' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, book, COUNT(label) AS label_count "
	end

	def add
		@bookmark.add
	end

	def remove
		@bookmark.remove
	end
end