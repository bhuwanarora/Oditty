class Bookmark::Node::BookLabel < Bookmark::Node
	Label = "book"

	def self.get_public user_id
		# Bookmark::Type::Public.new(user_id).match(Label) + ", COUNT(book) AS books_count "  + Bookmark::Node::BookLabel.with_group(Bookmark::Node::BookLabel.collect_map({"books" => Book.grouped_basic_info}), "books_count", "label","bookmark_node") +  Bookmark::Node::BookLabel.return_group("DISTINCT label.name AS shelf", "bookmark_node.created_at AS time", "books", "books_count") + Bookmark::Node::BookLabel.order_by("books_count")
		Bookmark::Type::Public.new(user_id).match(Label) + Bookmark::Node::BookLabel.return_group("DISTINCT label.name AS shelf", "bookmark_node.created_at AS time", "book", "label_count") + Bookmark::Node::BookLabel.order_init + " label_count DESC "
	end

	def self.get_visited user_id
		Bookmark::Type::Visited.new(user_id).match(Label) + Bookmark::Node::BookLabel.return_group(" DISTINCT label.key AS shelf ", "bookmark_node.created_at AS time", Book.basic_info, " label_count ")  + Bookmark::Node::BookLabel.order_init + " label_count DESC "  + Bookmark::Node::BookLabel.limit(Constant::Count::BooksShownInRoom) 
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