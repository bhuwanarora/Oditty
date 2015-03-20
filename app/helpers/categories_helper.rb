module CategoriesHelper
	def self.get_categories book_id
		neo = Neography::Rest.new
		match_clause = " MATCH (book) WHERE ID(book) = " + book_id.to_s + " MATCH (book)-[:FromCategory]->(:Category)-[:HasRoot*0..1]->(root_category{is_root:true}) "
		return_clause = " RETURN ID(root_category) AS id, root_category.icon AS icon, root_category.name AS name LIMIT 5"
		clause = match_clause + return_clause
		data = neo.execute_query clause
		data
	end
end
