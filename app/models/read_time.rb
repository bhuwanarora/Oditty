class ReadTime
	def initialize id
		@id = id
		if @id == Constants::TinyReadNode
			@last_book = Constants::BestTinyRead
			@relation = Constants::TinyReadRelation
			@next_where_clause = " toInt(book.page_count) <= 50 "
		elsif @id == Constants::SmallReadNode
			@last_book = Constants::BestSmallRead
			@relation = Constants::SmallReadRelation
			@next_where_clause = " toInt(book.page_count) > 50 AND toInt(book.page_count) <= 100 "
		elsif @id == Constants::NormalReadNode
			@last_book = Constants::BestNormalRead
			@relation = Constants::NormalReadRelation
			@next_where_clause = " toInt(book.page_count) < 100 AND toInt(book.page_count) <= 250"
		elsif @id == Constants::LongReadNode
			@last_book = Constants::BestLongRead
			@relation = Constants::LongReadRelation
			@next_where_clause = " toInt(book.page_count) > 250 "
		end
	end

	def match_nth_book skip
		" MATCH (book:Book)-[:"+@relation+"*.."+skip.to_s+"]->(nth_book) WHERE ID(book)="+@last_book.to_s+" WITH nth_book as book "
	end

	def match_books_after skip, count
		match_nth_book(skip) + " MATCH path=(book)-[:"+@relation+"*.."+count.to_s+"]->(last_book) WITH EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book  "
	end

	def where
		@next_where_clause
	end

	def last_book
		@last_book
	end

	def relation
		@relation
	end

	def match_books
		" MATCH (book) WHERE " + where
	end

	def match_books_init
		" MATCH (book:Book) WHERE " + where
	end

end