class Bookmark::Type::HaveLeftAMarkOnMe < Bookmark::Type
	def initialize
		@key = Bookmark.HaveLeftAMarkOnMe
		@name = "Have left a mark on me"
	end

	def self.match_clause id
		 " OPTIONAL MATCH (user)-[:Labelled]->(label:Label{indexed_label_name:\""+@key+"\"})-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book:Book) WHERE bookmark_node.user_id = " + id.to_s + " "
	end
end