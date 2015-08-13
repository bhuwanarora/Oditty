class Book::LongRead < Book
	Limit = 20

	def initialise
		@best_long_read ||= Constant::Id::BestLongRead
	end

	def self.match_best_read
		@best_long_read ||= Constant::Id::BestLongRead
		" MATCH (long_read:Book) WHERE ID(long_read) = " + @best_long_read.to_s+"  WITH long_read "
	end

	def self.path
		clause = " MATCH path = (node)-[:NextLongRead*" + Limit.to_s + "]->(last_node) WITH path "
	end

	def self.path_nodes length
		self.match_best_read + self.nth_node(length) + self.path + ", EXTRACT(n in nodes(path)|n) AS books UNWIND books AS book "
	end

	def self.nth_node length
		self.match_best_read + " MATCH (long_read)-[:NextLongRead*" + length.to_s + "]->(node) WITH node "
	end

	def self.path_nodes_after skip
		self.nth_node(skip) + self.path_nodes(Limit)
	end

	def self.get_sorted_books skip_count, limit=Limit
		Book::LongRead.nth_node(skip_count) + Book::LongRead.path + "," +  Book::LongRead.extract_unwind("book") + Book::LongRead.return_init + ::Book.basic_info + ::Book.order_desc + Book::LongRead.limit(Limit)
	end
end