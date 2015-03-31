class Rating < Neo
	def self.basic_info
		 " rating_node.rating AS rating, rating_node.book_id AS rated_book, rating_node.user_id AS rated_by, rating_node.timestamp AS rated_on  "
	end
end