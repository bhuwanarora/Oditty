module GraphHelper
	def self.set_genre_linked_list
		occurence_count = 0
		starting_book_id = Constant::Id::BestBook.to_i
		while occurence_count < 2
			match_clause = " MATCH (book) WHERE ID(book) = " + starting_book_id.to_s + " WITH book MATCH path = (book)-[:Next_book*10]->(last) " 
			extract_clause = " WITH last ,path, EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book WITH last ,book WHERE NOT (book)-[:NextInCategory]-() "
			collect_categorised = Category::Root.match_books_root + ",last WITH DISTINCT root_category, last ,COLLECT(book) AS books "
			create_links = " FOREACH(i in RANGE(0, length(books)-2) |  FOREACH(p1 in [books[i]] |  FOREACH(p2 in [books[i+1]] |  MERGE (p1)-[:NextInCategory{from_category:root_category.uuid}]->(p2)))) WITH last, root_category, head(books) as most_popular, last(books) as least_popular MATCH (last_node)-[r1:NextInCategory{from_category:root_category.uuid}]->(root_category) MERGE (least_popular)-[:NextInCategory{from_category:root_category.uuid}]->(root_category) MERGE (last_node)-[:NextInCategory{from_category:root_category.uuid}]->(most_popular) DELETE r1 WITH last MATCH (book) WHERE ID(book) = " + starting_book_id.to_s + " WITH book, last MATCH path = (book)-[:Next_book*1000]->(last) WITH last, path, EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book return ID(last) AS least_popular, ID(book) AS most_popular ORDER BY book.total_weight DESC LIMIT 1    "		
			clause = match_clause + extract_clause + collect_categorised + create_links
			info = clause.execute[0]
			occurence_count += Constant::Id::BestBook == info["most_popular"].to_i ? 1 : 0
			starting_book_id = info["least_popular"]
		end 

	end

	def self.set_era_linked_list
		starting_book_id = Constant::Id::BestBook.to_i
		match_clause = " MATCH (book) WHERE ID(book) = " + starting_book_id.to_s + " WITH book MATCH path = (book)-[:Next_book*]->(book) WHERE LENGTH(path) > 2 " 
		extract_clause = " WITH path, EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book "
		collect_categorised = Era.match_books + " WITH DISTINCT era, COLLECT(book) AS books "
		create_links = " FOREACH(i in RANGE(0, length(books)-2) |  FOREACH(p1 in [books[i]] |  FOREACH(p2 in [books[i+1]] |  MERGE (p1)-[:NextInEra{from_category:ID(era)}]->(p2)))) WITH era, head(books) as most_popular, last(books) as least_popular MERGE (least_popular)-[:NextInEra{from_category:ID(era)}]->(era)-[:NextInEra{from_category:ID(era)}]->(most_popular) "		
		clause = match_clause + extract_clause + collect_categorised + create_links
		clause.execute
	end

	def self.set_blogs
		blogs_set = false
		set_root = " MERGE (root:Blog{is_root:true}) MERGE (root)-[:NextPost]->(root) SET root.posted_at = \" 2014-04-28T12:06:25+05:30 \" RETURN root "
		set_root.execute
		while !blogs_set
			latest_blog = Blog.get_latest_blog.execute[0]
			Blog.handle
			updated_latest_blog = Blog.get_latest_blog.execute[0]
			if latest_blog["blog_url"] == updated_latest_blog["blog_url"]
				blogs_set = true
			end
		end
	end
end