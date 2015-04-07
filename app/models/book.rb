class Book < Neo
	def initialize id
		@id = id
	end

	def self.init_match
		" MATCH (book:Book) "
	end

	def get_feed
		" MATCH (book:Book)-[:BookFeed*0..]->(news_feed) WHERE ID(book) = " + @id.to_s + " RETURN labels(news_feed), news_feed "
	end

	def self.set_bookmark_count operation
		if operation == "+"
			" SET book.bookmark_count = TOINT(COALESCE(book.bookmark_count, 0)) + 1 "
		else
			" SET book.bookmark_count = TOINT(COALESCE(book.bookmark_count, 1)) - 1 "
		end
	end

	def match node_variable="book"
		" MATCH ("+ node_variable + ":Book) WHERE ID("+ node_variable + ")=" + @id.to_s + " WITH "+ node_variable + " "
	end

	def self.basic_info
		" ID(book) AS book_id, book.isbn AS isbn, book.title AS title, book.author_name AS author_name, book.pages_count AS pages_count, book.published_year AS published_year, TOINT(book.total_weight) as popularity"
	end

	def self.grouped_basic_info
		" id: ID(book), isbn: book.isbn, title: book.title, author_name: book.author_name, pages_count: book.pages_count, published_year: book.published_year, popularity: TOINT(book.total_weight) "
	end

	def self.match_genre
		" MATCH (book)-[belongs_to:Belongs_to]->(genre:Genre) "
	end

	def self.optional_match_genre
		" OPTIONAL " + self.match_genre
	end

	def self.get_small_reads
		Book::SmallRead.path_nodes + self.return_group(Book.basic_info)
	end

	def self.match_path relation, limit
		"MATCH path = (book)-[:" + relation.to_s + "*" + limit.to_s + "]-(last_in_path)"
	end

	def get_categories
		match_clause = " MATCH (book) WHERE ID(book) = " + @id.to_s + " MATCH (book)-[:FromCategory]->(:Category)-[:HasRoot*0..1]->(root_category{is_root:true}) RETURN "
		limit_clause = " LIMIT 5"
		clause = match_clause + Category.return_clause  + limit_clause
		clause
	end

	def self.detailed_info
		self.basic_info + ", book.readers_count as readers_count, book.bookmark_count as bookmark_count, book.comment_count as comment_count, book.description as description, book.external_thumb as external_thumb "
	end

	def self.match_root_category
		 " MATCH (book)-[from_category:FromCategory]->(category:Category)-[has_root:HasRoot*0..1]->(root_category:Category{is_root:true}) WITH DISTINCT(book) as book, COLLECT(DISTINCT("+Category::Root.grouped_basic_info+")) as root_category "
	end

	def self.optional_match_root_category
		" OPTIONAL "+self.match_root_category
	end

	def self.order_desc
		" ORDER BY book.total_weight DESC "
	end

	def self.get_complete_info
		UsersBook::Rate.optional_match + UsersBook::Endorse.optional_match + Book.optional_match_root_category + Book.return_group(Book.detailed_info, "rating_node.rating AS user_rating", " ID(endorse) AS endorse_status", " COLLECT(ID(root_category)) AS root_category_ids ")
	end

	def self.set_endorse_count operation
		if operation == "+"
			" SET book.endorse_count = COALESCE(book.endorse_count, 0)) + 1 " 
		else
			" SET book.endorse_count = COALESCE(book.endorse_count, 1)) - 1 " 
		end
	end

	def self.set_rating_count operation
		if operation == "+"
			" SET book.rating_count = COALESCE(book.rating_count, 0)) + 1 "
		else
			" SET book.rating_count = COALESCE(book.rating_count, 1)) - 1 "
		end
	end
end