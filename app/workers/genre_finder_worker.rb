module GenreFinderWorker
	def self.find_genres user_id, book_titles
		for book_title in book_titles
			book_title = book_title.gsub(" ","").downcase
			
			start_clause = "START book = node:node_auto_index('indexed_title:(" + indexed_titles.to_s + ")') WITH book"
			merge_clause = "MATCH (book)-[from_category:FromCategory]->(category)-(category)-[:HasRoot*0..1]->(root_category{is_root:true}) WITH root_category MERGE (user)-[rel:LikesCategory]-(root_category) WHERE ID(user) = " + user_id.to_s + " SET rel.weight = COALESCE(rel.weight,0) + 1 WITH user MERGE (user)-[rel:LikesCategory]-(root_category{is_root:true}) ON CREATE SET rel.weight = 0 "
			# , length(path) as length, nodes(path) AS x UNWIND x AS categories MATCH recursive_path = (node)-[:HasRoot*]-(category) WITH node, path MERGE (user)-[like:LikesCategory]->(category) ON CREATE SET like.weight = (" + Constants::LikWeight.to_s + "*1.0)/ (FOREACH (node in nodes(path) | MERGE (user)-[:LikesCategory]-(node) WHERE ID(user) = " + user_id.to_s + " ON CREATE SET  "
			clause = start_clause + merge_clause
			self.execute_query(clause)
		end
	end
end