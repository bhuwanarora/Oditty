class Bookmark::Node::BookLabel < Bookmark::Node

	def self.match_clause
		"MATCH (user:User), (book:Book) WHERE ID(user) = " + @user_id.to_s + " AND ID(book) = " + @id.to_s + " "
	end

	def self.get_public user_id
		Bookmark::Type::Public.new(user_id).match + Bookmark::Node::BookLabel.return_group("DISTINCT label.name AS shelf", "bookmark_node.timestamp AS time", Book.basic_info, "label_count") + Bookmark::Node::BookLabel.order_init + " label_count, time DESC "  + Bookmark::Node::BookLabel.limit(Constants::BooksShownInRoomCount) 
	end

	def self.get_visited user_id
		Bookmark::Type::Visited.new(user_id).match + Bookmark::Node::BookLabel.return_group(" DISTINCT label.name AS shelf ", "bookmark_node.timestamp AS time", Book.basic_info, " label_count ")  + Bookmark::Node::BookLabel.order_init + " label_count, time DESC "  + Bookmark::Node::BookLabel.limit(Constants::BooksShownInRoomCount) 
	end

	def self.match_path
		super
	end

	def self.match_not
		super
	end

	def self.match
		super
	end
end