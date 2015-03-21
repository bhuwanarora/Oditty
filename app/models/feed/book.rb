class Feed::Book < Neo
	def initialize book_id
		@book_id = book_id
	end

	def create object
		" MATCH (book)-[old:BookFeed]->(old_feed) CREATE UNIQUE (book)-[:BookFeed{book_id:"+@book_id.to_s+"}]->(" + object + ")-[:BookFeed{book_id:"+@book_id.to_s+"}]->(old_feed) DELETE old WITH book, "+object
	end
end