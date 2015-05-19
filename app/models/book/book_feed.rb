class Book::BookFeed < Book
	Limit = 10
	def initialize book_id
		@book_id = book_id
		@book = Book.new(@book_id)
	end

	def create object
		@book.match + "," + object + " MATCH (book)-[old:BookFeed]->(old_feed) OPTIONAL MATCH (n1)-[r1:BookFeed{book_id:" + @book_id.to_s + "}]->(" + object + ")-[r2:BookFeed{book_id:" + @book_id.to_s + "}]->(n2) FOREACH( ignore IN CASE WHEN r1 IS NOT NULL AND r2 IS NOT NULL THEN [1] ELSE [] END| MERGE (n1)-[:BookFeed{book_id:" + @book_id.to_s + "}]->(n2) DELETE r1, r2 ) MERGE (book)-[:BookFeed{book_id:" + @book_id.to_s + "}]->(" + object + ")-[:BookFeed{book_id:" + @book_id.to_s + "}]->(old_feed) DELETE old  WITH book, " + object + " "

	end

	def self.delete_feed(object, user_id) 
		get_bookfeed_relations_for_m = " MATCH (s)-[b1:BookFeed]->("+object+")-[b2:BookFeed]->(e) "
		create_new_relations_in_place = " CREATE (s)-[:BookFeed{user_id:"+user_id.to_s+"}]->(e) "
		delete_old_relations = "DELETE b1, b2 "
		with_clause = "WITH user, book, "+ object + " "
		clause = get_bookfeed_relations_for_m + create_new_relations_in_place + delete_old_relations + with_clause
		clause
	end

	def get_feed skip_count=0
		@book.match + Book::BookFeed.match(skip_count) + Book::BookFeed.return_group("labels(feed) AS labels", "feed AS feed")
	end

	def self.match skip_count
		" MATCH (book)-[:BookFeed*" + skip_count.to_s + ".." + Limit.to_s + "]->(feed) "
	end

end