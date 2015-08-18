module GenreHelper
	
	def self.init_variables
		@@genre_search_index 	= UniqueSearchIndexHelper::UniqueIndices[Constant::NodeLabel::Genre][0]
		@@category_search_index = UniqueSearchIndexHelper::UniqueIndices[Constant::NodeLabel::Category][0]
	end

	def self.convert_genre_to_category
		clause = ""\
				" MATCH (genre:Genre) "\
				" WHERE NOT genre:Category "\
				" SET genre." + @@category_search_index + " = genre." + @@genre_search_index + " "
		clause.execute
	end

	def self.convert_category_to_genre
		clause = ""\
				" MATCH (category:Category)<-[:FromCategory]-(books:Book) "\
				" WHERE NOT category:Genre "\
				" SET category." + @@genre_search_index + " = category." + @@category_search_index + ", "\
				" 	  category.books_count = COUNT(books) "
		clause.execute
		clause = ""\
				" MATCH (category:Category) "\
				" WHERE NOT (category)-[:FromCategory]-(:Book) "\
				" SET category.books_count = 0 "
		clause.execute
	end

	def self.match_in_range_with_category search_prefix
		clause = ""\
				" MATCH (genre:Genre),(category:Category) "\
				" WHERE genre." + @@genre_search_index + "=~ \'" + search_prefix + ".*\' "\
				" AND "\
				" category." + @@category_search_index + "=~ \'" + search_prefix + ".*\' "\
				" WITH genre, category "
		clause
	end

	def self.exact_match_with_category
		clause = ""\
				" WHERE genre." + @@genre_search_index + "= category." + @@category_search_index + " "\
				" WITH category, genre LIMIT 1 "
	end

	def self.copy_category_properties
		clause = " SET genre." + @@category_search_index + "= genre." + @@genre_search_index + ", "\
				" genre.uuid = (CASE WHEN HAS(category.uuid) THEN category.uuid ELSE NULL END), "\
				" genre.is_root = (CASE WHEN HAS(category.is_root) THEN category.is_root ELSE NULL END)"\
				" WITH genre, category "
	end

	# def self.copy_category_edges init_clause
	# 	params = {
	# 		:source_node 		=> "category",
	# 		:destination_node	=> "genre",
	# 		:init_clause 		=> init_clause
	# 	}

	# 	params[:edge_types] = {
	# 							'FromCategory' 	=> ['Book'],
	# 							'HasRoot' 		=> ['Category'],
	# 							'Likes' 		=> ['User'],
	# 							'HasChild' 		=> ['Category']
	# 	}

	# 	clause = GraphHelper.generic_copy_incoming_edges params
	# 	params[:edge_types] = {
	# 							'HasRoot' 		=> ['Category'],
	# 							'HasChild' 		=> ['Category']
	# 	}
	# 	clause += GraphHelper.generic_copy_outgoing_edges params
	# end

	def self.optional_copy_category_edges
		params = {
			:source_node 		=> "category",
			:destination_node	=> "genre",
			:with_elements 		=> [],
		}
		params[:edge_types] = {
								'FromCategory' 	=> ['Book'],
								'HasRoot' 		=> ['Category'],
								'Likes' 		=> ['User'],
								'HasChild' 		=> ['Category']
		}
		clause = GraphHelper.generic_optional_copy_incoming_edges params
		params[:edge_types] = {
								'HasRoot' 		=> ['Category'],
								'HasChild' 		=> ['Category']	
		}
		params[:with_elements] = []
		clause += GraphHelper.generic_optional_copy_outgoing_edges params
	end

	def self.delete_category_node node_id
		" MATCH (category) "\
		" WHERE ID(category) = " + node_id.to_s + " "\
		" OPTIONAL MATCH (category)-[r]-()"\
		" DELETE r, category "\
		""
	end

	# def self.merge_common_category_genre_in_range_multiple_cyphers search_prefix
	# 	clause  = GenreHelper.match_in_range_with_category search_prefix
	# 	clause += GenreHelper.exact_match_with_category
	# 	clause += GenreHelper.copy_category_properties
	# 	clause += " RETURN ID(category) AS category_id, ID(genre) AS genre_id "
	# 	output = clause.execute
	# 	if output.present?
	# 		clause = Neo.match_multiple_nodes_by_id({"category" => output[0]["category_id"], "genre" => output[0]["genre_id"]})
	# 		GenreHelper.copy_category_edges clause
	# 		clause += " SET genre:Category "\
	# 				" RETURN ID(genre) AS id_g, genre.name AS name_g, ID(category) AS id_c, category.name AS name_c "
	# 		output = clause.execute
	# 		@@logger.info("Search_prefix: #{search_prefix} Genre_id: #{output[0]['id_g']}, Genre_name: #{output[0]['name_g']}, Category_id: #{output[0]['id_c']}, Category_name: #{output[0]['name_c']}")
	# 		GenreHelper.delete_category_node(output[0]["id_c"]).execute
	# 	else
	# 		@@logger.info("Changing Search_prefix...")
	# 	end
	# end

	def self.merge_common_category_genre_in_range search_prefix
		return_output = 0
		clause  = GenreHelper.match_in_range_with_category search_prefix
		clause += GenreHelper.exact_match_with_category
		clause += GenreHelper.copy_category_properties
		clause += GenreHelper.optional_copy_category_edges
		clause += " SET genre:Category "\
					" RETURN ID(genre) AS id_g, genre.name AS name_g, ID(category) AS id_c, category.name AS name_c "
		output = clause.execute
		if output.present?
			return_output = 1
			@@logger.info("Search_prefix: #{search_prefix} Genre_id: #{output[0]['id_g']}, Genre_name: #{output[0]['name_g']}, Category_id: #{output[0]['id_c']}, Category_name: #{output[0]['name_c']}")
			GenreHelper.delete_category_node(output[0]["id_c"]).execute
		else
			@@logger.info("Changing Search_prefix...")
		end
		return_output
	end

	def self.merge_common_category_genre
		category_genre_prefix_regex = 'merge_category_genre_regex'
		@@logger = GraphHelper.log_setup category_genre_prefix_regex
		cur_index = ""
		if (!$redis[category_genre_prefix_regex].nil?)			
			cur_index = $redis[category_genre_prefix_regex]
		else
			cur_index = "aaa"
			$redis[category_genre_prefix_regex] = cur_index
		end
		params = {
			:node_label =>[Constant::NodeLabel::Genre, Constant::NodeLabel::Category]
		}
		while (cur_index != "")
			params[:prefix_search_index] = cur_index
			cur_index = GraphHelper.manage_node_pair_index_prefix params
			puts "Selected index: #{cur_index}"
			matched   = GenreHelper.merge_common_category_genre_in_range(cur_index)
			if matched == 0
				puts "No match with #{cur_index}. Incrementing the index"
				cur_index = GraphHelper.next_regex_recursive(cur_index, cur_index.length - 1)
				$redis[category_genre_prefix_regex] = cur_index
			end
		end
	end

	def self.set_search_indices
		UniqueSearchIndexHelper.set_search_indices Constant::NodeLabel::Genre
		UniqueSearchIndexHelper.set_search_indices Constant::NodeLabel::Category
	end

	def self.merge_with_category
		GenreHelper.init_variables
		GenreHelper.merge_common_category_genre
		GenreHelper.convert_category_to_genre
		GenreHelper.convert_genre_to_category
	end
	
end