class Bookmark::Type::Visited < Bookmark::Type
	def initialize(user_id, media_id=nil)
		@name = "Visited"
		@key = "Visited"
		@user_id = user_id
		@media_id = media_id
		@bookmark = Bookmark.new(@user_id, @media_id, @key)
	end
	def self.get_key
		"Visited"
	end
	def match media = "book"
		Bookmark.match_path(media) + " WHERE label.key = '"+@key+"' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, " + media +  ", COUNT(label) AS label_count "
	end

	def self.match media = "book"
		Bookmark.match_path(media) + " WHERE label.key = 'Visited' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, " + media +  ", COUNT(label) AS label_count "
	end

	def self.match_label media="book", media_label
		Bookmark.match_path_label(media, media_label) + " WHERE label.key = 'Visited' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, " + media +  ", COUNT(label) AS label_count "
		# Bookmark.match_path(media, media_label) + " WHERE label.key = '"+@key+"' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, " + media +  ", COUNT(label) AS label_count "
	end

	def add
		@bookmark.add
	end

	def set_news_view_count
		News.new(@media_id).set_view_count
	end

	def remove
		@bookmark.remove
	end
end