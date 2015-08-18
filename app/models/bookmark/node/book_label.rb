class Bookmark::Node::BookLabel < Bookmark::Node
	NodeLabel = "book"

	def self.get_public user_id
		Label.match_public + ", user WHERE label: BookShelf "  + Label.optional_match_books + Bookmark::Node::BookLabel.return_group("DISTINCT label.name AS shelf", "label.key as label_key", "book AS books", "label_count AS label_count")
	end

	def self.get_visited user_id
		Bookmark::Type::Visited.new(user_id).match(NodeLabel) + Bookmark::Node::BookLabel.return_group(" DISTINCT label.key AS shelf ", "bookmark_node.created_at AS time", Book.basic_info, " label_count ")  + Bookmark::Node::BookLabel.order_init + " label_count DESC "  + Bookmark::Node::BookLabel.limit(Constant::Count::BooksShownInRoom) 
	end

	def self.get_visited_with_label user_id, media_label="Book"
		Bookmark::Type::Visited.new(user_id).match_label(NodeLabel, media_label) + Bookmark::Node::BookLabel.return_group(" DISTINCT label.key AS shelf ", "bookmark_node.created_at AS time", Book.basic_info, " label_count ")  + Bookmark::Node::BookLabel.order_init + " label_count DESC "  + Bookmark::Node::BookLabel.limit(Constant::Count::BooksShownInRoom) 
	end

	def self.match_path
		Bookmark.match_path "book"
	end

	def self.match_path_label
		Bookmark.match_path_label "book", "User", "Book"
	end

	def self.optional_match_path
		Bookmark.optional_match_path "book"
	end

	def self.optional_match_path_public
		Bookmark.optional_match_path_public "book"
	end

	def self.match_not
		Bookmark.match_not "book"
	end

	def self.match
		super
	end
end