class Bookmark::Node::BookLabel < Bookmark::Node
	NodeLabel = "book"

	def self.get_public user_id
		Label.match_public + Label.optional_match_books + Bookmark::Node::BookLabel.return_group("DISTINCT label.name AS shelf", "label.key as label_key", "book AS books", "label_count AS label_count")
	end

	def self.get_visited user_id
		Bookmark::Type::Visited.new(user_id).match(NodeLabel) + Bookmark::Node::BookLabel.return_group(" DISTINCT label.key AS shelf ", "bookmark_node.created_at AS time", Book.basic_info, " label_count ")  + Bookmark::Node::BookLabel.order_init + " label_count DESC "  + Bookmark::Node::BookLabel.limit(Constant::Count::BooksShownInRoom) 
	end

	def self.match_path
		Bookmark.match_path "book"
	end

	def self.match_not
		Bookmark.match_not "book"
	end

	def self.match
		super
	end
end