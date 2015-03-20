class User::Predict::Category < User::Predict
	def get_favourite_categories
		neo = Neography::Rest.new
		match_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true}) WHERE ID(user) = " + @user_id.to_s + " RETURN "
		sort_clause = " ORDER BY likes_category.weight DESC"
		clause = match_clause + Category.get_basic_info + sort_clause
		clause
	end
	
end