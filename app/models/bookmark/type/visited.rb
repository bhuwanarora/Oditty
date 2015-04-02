class Bookmark::Type::Visited < Bookmark::Type
	def initialize user_id
		@user_id = user_id
		@name = "Visited"
	end

	def match
		Bookmark::Node::BookLabel.match_path + " WHERE bookmark_node.name = '"+@name+"' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, book, COUNT(label) AS label_count "
	end
end