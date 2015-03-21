class Book::SmallRead < Book
	Limit = 30

	def initialise
		@best_small_read ||= Constants::BestSmallRead
	end

	def self.best_match_clause
		@best_small_read ||= Constants::BestSmallRead
		" MATCH (small_read:Book) WHERE ID(small_read) = " + @best_small_read.to_s+"  WITH small_read "
	end

	def self.path start_id, length
		length = Limit if length == 0
		clause = " MATCH path = (small_read:Book)-[:NextSmallRead*" + length.to_s + "]-(last_node) WHERE ID(small_read) = " + start_id.to_s + "  WITH path "
	end

	def self.path_nodes start_id, length
		self.path(start_id, length) + ", EXTRACT(n in nodes(path)|n) AS books UNWIND books AS book"
	end
end