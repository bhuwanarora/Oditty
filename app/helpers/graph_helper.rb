module GraphHelper
	def self.set_genre_linked_list
		most_popular_book_id = Constants::BestBook.to_i
		starting_book_id = Constants::BestBook.to_i
		maximum_popular_book_occurence_count = 0
		clause = "MATCH (category:Category{is_root: true}) WITH category CREATE UNIQUE (category)-[:NextInCategory{from_category:category.uuid}]->(category)"
		# clause.execute
		while maximum_popular_book_occurence_count < 2
			match_clause = " MATCH popularity_list = (book:Book)-[:Next_book*" + Constants::QueryStepDuringLinking.to_s + "]->(next_book) WHERE ID(book) = " + starting_book_id.to_s 
			unwind_book_collection_clause = " WITH next_book AS least_popular_book_in_path, EXTRACT(n IN nodes(popularity_list)|n) AS books UNWIND books as book "
			match_book_to_root_clause = " WITH least_popular_book_in_path, book MATCH (book)-[:FromCategory]->(category:Category)-[:HasRoot*0..1]->(root_category:Category{is_root:true}) "
			get_last_linked_node_clause = "  WITH DISTINCT(book) AS book, root_category, root_category.uuid AS uuid , least_popular_book_in_path OPTIONAL MATCH (root_category)<-[old:NextInCategory]-(last_node) OPTIONAL MATCH (book)-[already_linked:NextInCategory{from_category:uuid}]-()   "
			conditionally_make_relation_clause = " FOREACH (ignore IN CASE WHEN  already_linked IS NULL AND uuid IS NOT NULL THEN [old] ELSE [] END | MERGE (last_node)-[:NextInCategory{from_category:uuid}]->(book)-[:NextInCategory{from_category:uuid}]->(root_category)  DELETE old) RETURN ID(book) AS most_popular_book_id, ID(least_popular_book_in_path) AS least_popular_book_id  ORDER BY book.total_weight DESC LIMIT 1"
			clause = match_clause + unwind_book_collection_clause + match_book_to_root_clause + get_last_linked_node_clause + conditionally_make_relation_clause
			data = clause.print
			puts data
			most_popular_book_id = data[0]["most_popular_book_id"].to_i
			starting_book_id = data[0]["least_popular_book_id"].nil? ? (starting_book_id + Constants::QueryStepDuringLinking) : data[0]["least_popular_book_id"].to_i
			maximum_popular_book_occurence_count += most_popular_book_id  == Constants::BestBook ? 1 : 0
			break
		end
	end
end