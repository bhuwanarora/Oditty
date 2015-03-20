module CategoriesHelper
	def self.get_categories book_id
		neo = Neography::Rest.new
		match_clause = " MATCH (book) WHERE ID(book) = " + book_id.to_s + " MATCH (book)-[:FromCategory]->(:Category)-[:HasRoot*0..1]->(root_category{is_root:true}) RETURN "
		limit_clause = " LIMIT 5"
		clause = match_clause + self.return_category_properties_clause  + limit_clause
		neo.execute_query clause
	end

	def self.get_sorted_genres user_id
		neo = Neography::Rest.new
		match_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true}) WHERE ID(user) = " + user_id.to_s + " RETURN "
		sort_clause = " ORDER BY likes_category.weight DESC"
		clause = match_clause + self.return_category_properties_clause + sort_clause
		neo.execute_query clause
	end

	def self.return_category_properties_clause
		return_clause = " ID(root_category) AS id, root_category.icon AS icon, root_category.name AS name, root_category.aws_key AS aws"
	end
end
