class Bookmark::Type::HaveLeftAMarkOnMe < Bookmark::Type
	def initialize(user_id, book_id)
		@key = "HaveLeftAMarkOnMe"
		@name = "Have left a mark on me"
		@user_id = user_id
		@book_id = book_id
		@bookmark = Bookmark.new(@user_id, @book_id, @key)
	end

	def self.match user_id
		@key ||= "HaveLeftAMarkOnMe"
		" OPTIONAL MATCH (user)-[:Labelled]->(label:Label{indexed_label_name:\""+@key+"\"})-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book:Book) WHERE bookmark_node.user_id = " + user_id.to_s + " "
	end

	def add
		@bookmark.add
	end

	def remove
		@bookmark.remove
	end
end