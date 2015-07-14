class Book::BookFeed < Book
	Limit = 10
	def initialize book_id
		@book_id = book_id
		@book = Book.new(@book_id)
	end

	def create object
		" MATCH (book)-[old:BookFeed]->(old_feed) CREATE UNIQUE (book)-[:BookFeed]->(" + object + ")-[:BookFeed]->(old_feed) DELETE old WITH user, book, " + object + " "
	end

	def self.delete_feed(object) 
		" MATCH (s)-[b1:BookFeed]->("+object+")-[b2:BookFeed]->(e) "\
		" CREATE (s)-[:BookFeed]->(e) "\
		" DELETE b1, b2 "\
		" WITH book, "+ object + " "
	end

	def get_feed skip_count=0
		@book.match + Book::BookFeed.match(skip_count) + Book::BookFeed.return_group("labels(feed) AS labels", "feed AS feed")
	end

	def self.match skip_count
		skip_count = skip_count + 1
		" MATCH (book)-[:BookFeed*" + skip_count.to_s + ".." + (skip_count + Limit - 1).to_s + "]->(feed) "
	end

end