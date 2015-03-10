module GenreFinderWorker
	def self.find_genres user_id, book_titles
		for book_title in book_titles
			book_title = book_title.gsub(" ","").downcase
			
			start_clause = "START book = node:node_auto_index('indexed_title:(" + indexed_titles.to_s + ")') WITH book"
			merge_clause = "MATCH (book)-[from_category:FromCategory]->(category) WITH category MATCH path = (category)-[:HasRoot*..]->(root_category) WHERE NOT ((root_category)-[:HasRoot]->()) WITH root_category MATCH (user) WHERE ID(user) = " + user_id.to_s + " WITH root_category, user MERGE (user)-[rel:Likes]-(root_category) SET rel.intensity = COALESCE(rel.intensity,0) + 1"
			# , length(path) as length, nodes(path) AS x UNWIND x AS categories MATCH recursive_path = (node)-[:HasRoot*]-(category) WITH node, path MERGE (user)-[like:Likes]->(category) ON CREATE SET like.weight = (" + Constants::LikWeight.to_s + "*1.0)/ (FOREACH (node in nodes(path) | MERGE (user)-[:Likes]-(node) WHERE ID(user) = " + user_id.to_s + " ON CREATE SET  "
			clause = start_clause + merge_clause
			self.execute_query(clause)
		end
		genre_count_hash = genres.flatten!.each_with_object(Hash.new(0)) {|genre, count| count[genre] += 1}
	end
end