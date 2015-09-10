class Book::BookFeed < Book
	Limit = 10
	def initialize book_id
		@book_id = book_id
		@book = Book.new(@book_id)
	end

	def create object
		" MATCH (book)-[old:BookFeed]->(old_feed) CREATE UNIQUE (book)-[:BookFeed]->(" + object + ")-[:BookFeed]->(old_feed) DELETE old WITH user, book, " + object + " "
	end

	def self.delete_feed object
		" MATCH (s)-[b1:BookFeed]->("+object+")-[b2:BookFeed]->(e) "\
		" CREATE (s)-[:BookFeed]->(e) "\
		" DELETE b1, b2 "\
		" WITH book, "+ object + " "
	end

	def self.create_self_feed
		" OPTIONAL MATCH (book)-[bookfeed:BookFeed]->() "\
		" FOREACH (ignore IN (CASE WHEN bookfeed IS NULL THEN [1] ELSE [] END) |"\
		" 	CREATE UNIQUE (book)-[:BookFeed]->(book) "\
		" ) "
	end

	def self.delete_feed_optional object, with_elements
		" OPTIONAL MATCH (s)-[b1:BookFeed]->(" + object + ")-[b2:BookFeed]->(e) "\
		" WITH " + object + ", COLLECT([s, e]) AS path_nodes, COLLECT([b1, b2]) AS path_edges " + with_elements.map{|elem| (", " + elem)}.join("") + " "\
		" FOREACH (elem in (CASE WHEN path_nodes[1] IS NULL THEN [] ELSE path_nodes END )| "\
			"FOREACH (node1 IN [elem[0]] | "\
				" FOREACH (node2 IN [elem[1]] | "\
					" CREATE (node1)-[:BookFeed]->(node2) "\
				")"\
			")"\
		")"\
		" FOREACH (elem in (CASE WHEN path_edges[0] IS NULL THEN [] ELSE path_edges END)| "\
			"FOREACH (rel1 IN [elem[0]] | "\
				" FOREACH (rel2 IN [elem[1]] | "\
					" DELETE rel1, rel2 "\
				" )"\
			" )"\
		" )"\
		" WITH  "+ object + " " + with_elements.map{|elem| (", " +elem)}.join("") + " "
	end

	def get_feed skip_count=0
		@book.match + Book::BookFeed.match(skip_count) + Book::BookFeed.return_group("labels(feed) AS labels", "feed AS feed")
	end

	def self.match skip_count
		skip_count = skip_count + 1
		" MATCH (book)-[:BookFeed*" + skip_count.to_s + ".." + (skip_count + Limit - 1).to_s + "]->(feed) "
	end

end