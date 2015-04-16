class Bookmark::Type::Visited < Bookmark::Type
	def initialize(user_id, book_id=nil)
		@name = "Visited"
		@key = "Visited"
		@user_id = user_id
		@book_id = book_id
		@bookmark = Bookmark.new(@user_id, @book_id, @key)
	end

	def match
		Bookmark::Node::BookLabel.match_path + " WHERE label.key = '"+@key+"' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, book, COUNT(label) AS label_count "
	end

	def self.match
		Bookmark::Node::BookLabel.match_path + " WHERE label.key = 'Visited' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, book  "
	end


	def add
		@bookmark.add
	end

	def remove
		@bookmark.remove
	end
end