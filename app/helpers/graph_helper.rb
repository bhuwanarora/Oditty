module GraphHelper
	def self.set_genre_linked_list
		starting_book_id = Constant::Id::BestBook.to_i
		match_clause = " MATCH (book) WHERE ID(book) = " + starting_book_id.to_s + " WITH book MATCH path = (book)-[:Next_book*]->(book) WHERE LENGTH(path) > 2 " 
		extract_clause = " WITH path, EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book "
		collect_categorised = Category::Root.match_books_root + " WITH DISTINCT root_category, COLLECT(book) AS books "
		create_links = " FOREACH(i in RANGE(0, length(books)-2) |  FOREACH(p1 in [books[i]] |  FOREACH(p2 in [books[i+1]] |  MERGE (p1)-[:NextInCategory{from_category:root_category.uuid}]->(p2)))) WITH root_category, head(books) as most_popular, last(books) as least_popular MERGE (least_popular)-[:NextInCategory{from_category:root_category.uuid}]->(root_category)-[:NextInCategory{from_category:root_category.uuid}]->(most_popular) "		
		clause = match_clause + extract_clause + collect_categorised + create_links
		clause.execute
	end

	def self.set_era_linked_list
		starting_book_id = Constant::Id::BestBook.to_i
		match_clause = " MATCH (book) WHERE ID(book) = " + starting_book_id.to_s + " WITH book MATCH path = (book)-[:Next_book*]->(book) WHERE LENGTH(path) > 2 " 
		extract_clause = " WITH path, EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book "
		collect_categorised = Era.match_books + " WITH DISTINCT root_category, COLLECT(book) AS books "
		create_links = " FOREACH(i in RANGE(0, length(books)-2) |  FOREACH(p1 in [books[i]] |  FOREACH(p2 in [books[i+1]] |  MERGE (p1)-[:NextInEra{from_category:ID(era)}]->(p2)))) WITH root_category, head(books) as most_popular, last(books) as least_popular MERGE (least_popular)-[:NextInEra{from_category:ID(era)}]->(root_category)-[:NextInEra{from_category:ID(era)}]->(most_popular) "		
		clause = match_clause + extract_clause + collect_categorised + create_links
		clause.execute
	end
end