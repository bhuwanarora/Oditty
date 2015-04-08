class Rating < Neo
	def self.basic_info
		" rating_node.rating AS rating, rating_node.book_id AS rated_book, rating_node.user_id AS rated_by, rating_node.timestamp AS rated_on  "
	end

	def self.grouped_basic_info
		" {rating: rating_node.rating, rated_book_id: rating_node.book_id, rated_by: rating_node.user_id, rated_on: rating_node.timestamp} AS rating_node "
	end
end