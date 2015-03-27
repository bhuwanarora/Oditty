class Bookmark::Node::BookLabel < Bookmark::Node

	def self.match_clause
		"MATCH (user:User), (book:Book) WHERE ID(user) = " + @user_id.to_s + " AND ID(book) = " + @id.to_s + " "
	end

	def self.get_public
		where_clause = " WHERE bookmark_node.public = true WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, book, COUNT(label) AS label_count "
		select_distinct_properties_clause = " DISTINCT label.name AS shelf,  bookmark_node.timestamp AS time, "

		Bookmark::Node::BookLabel.match_path + where_clause + self.return_init + select_distinct_properties_clause + ::Book.basic_info  + self.order_init + " label_count, time DESC "  + self.limit(Constants::BooksShownInRoomCount) 
	end

	def self.get_visited
		where_clause = " WHERE bookmark_node.name = 'Visited' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, book, COUNT(label) AS label_count "
		select_distinct_properties_clause = " DISTINCT label.name AS shelf,  bookmark_node.timestamp AS time, "
		Bookmark::Node::BookLabel.match_path + where_clause + self.return_init + select_distinct_properties_clause + ::Book.basic_info  + self.order_init + " label_count, time DESC "  + self.limit(Constants::BooksShownInRoomCount) 
	end

	def self.match_path
		super("book")		
	end

	def self.match_not
		super("book")		
	end

	def self.match
		super("book")
	end
end