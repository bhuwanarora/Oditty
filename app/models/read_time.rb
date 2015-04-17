class ReadTime
	def initialize id
		@id = id
		if @id == Constant::Id::TinyReadNode
			@last_book = Constant::Id::BestTinyRead
			@relation = Constant::Label::TinyReadRelation
			@next_where_clause = " toInt(book.page_count) <= 50 "
		elsif @id == Constant::Id::SmallReadNode
			@last_book = Constant::Id::BestSmallRead
			@relation = Constant::Label::SmallReadRelation
			@next_where_clause = " toInt(book.page_count) > 50 AND toInt(book.page_count) <= 100 "
		elsif @id == Constant::Id::NormalReadNode
			@last_book = Constant::Id::BestNormalRead
			@relation = Constant::Label::NormalReadRelation
			@next_where_clause = " toInt(book.page_count) < 100 AND toInt(book.page_count) <= 250"
		elsif @id == Constant::Id::LongReadNode
			@last_book = Constant::Id::BestLongRead
			@relation = Constant::Label::LongReadRelation
			@next_where_clause = " toInt(book.page_count) > 250 "
		end
	end

	def match_nth_book skip_count
		puts @relation
		puts skip_count
		puts @last_book
		" MATCH (book:Book)-[:" + @relation + "*" + skip_count.to_s + "]->(nth_book:Book) WHERE ID(book)=" + @last_book.to_s + " WITH nth_book as book "
	end

	def match_books_after skip, count
		match_nth_book(skip) + " MATCH path=(book)-[:" + @relation + "*" + count.to_s + "]->(last_book:Book) WITH EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book  "
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