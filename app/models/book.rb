class Book < Neo
	def initialize id
		@id = id
	end

	def get_feed
		"MATCH (book:Book)-[:BookFeed*0..]->(news_feed) WHERE ID(book) = " + @id.to_s + " RETURN labels(news_feed), news_feed"
	end

	def match_book
		"MATCH (book:Book) WHERE ID(book)=" + @id.to_s
	end

	def self.get_basic_info
		" ID(book) AS book_id, book.isbn AS isbn, book.title AS title, book.author_name AS author_name, book.pages_count AS pages_count, book.published_year AS published_year, TOINT(book.total_weight) as popularity"
	end

	def self.mark_as_read
		", ID(mark_as_read) AS status"
	end

	def self.rating
		", rating_node.rating AS user_rating"
	end

	def self.genre_clause
		"OPTIONAL MATCH (book)-[belongs_to:Belongs_to]->(genre:Genre) "
	end

	def self.get_small_reads
		small_reads_clause = " MATCH path = (book)-[:NextSmallRead*" + Constants::RecommendationBookCount.to_s + "]->(tiny_read) WHERE ID(book) = " + Constants::BestSmallRead.to_s + " WITH EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book RETURN "
		clause = small_reads_clause + Book.get_basic_info
		clause
	end

	def get_categories
		match_clause = " MATCH (book) WHERE ID(book) = " + @id.to_s + " MATCH (book)-[:FromCategory]->(:Category)-[:HasRoot*0..1]->(root_category{is_root:true}) RETURN "
		limit_clause = " LIMIT 5"
		clause = match_clause + Category.return_clause  + limit_clause
		clause
	end

	def self.get_detailed_info
		clause = " book.title as title, book.author_name as author_name, ID(book) as book_id, book.readers_count as readers_count, book.bookmark_count as bookmark_count, book.comment_count as comment_count, book.published_year as published_year, book.page_count as page_count, book.description as description, book.external_thumb as external_thumb "
		clause
	end

	def self.root_category_clause
		 " MATCH (book)-[from_category:FromCategory]->(category:Category)-[has_root:HasRoot*0..1]->(root_category:Category{is_root:true}) "
	end

	def self.order_desc
		" ORDER BY book.total_weight DESC "
	end

end