module GenreFinderWorker
	def self.find_genres_for_books user_id, book_titles
		for book_title in book_titles
			self.find_genres_for_book user_id, book_title
		end
	end

	def self.find_genres_for_book user_id. book_title
		book_title = book_title.gsub(" ","").downcase
		
		start_clause = "START book = node:node_auto_index('indexed_title:(\"" + indexed_titles.to_s + "\")') WITH book"

		relate_user_categories_clause = " MATCH (book)-[from_category:FromCategory]->(category:Category)-[:HasRoot*0..1]->(root_category{is_root:true}) WITH root_category MATCH (user)  WHERE ID(user) = " + user_id.to_s + " WITH root_category, user MERGE (user)-[rel:Likes]-(root_category) ON MATCH SET rel.weight = COALESCE(rel.weight,0)+1 " 

		clause = start_clause + relate_user_categories_clause
		self.execute_query(clause)
	end
end