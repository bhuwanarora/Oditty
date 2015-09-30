module GenreHelper
	
	def self.set_up_redis label, key
		GenericHelper.set_up_redis label, key
	end
	def self.update_redis key, value
		GenericHelper.update_redis key, value
	end

	def self.init_variables
		@@genre_search_index 	= UniqueSearchIndexHelper::UniqueIndices[Constant::NodeLabel::Genre][0]
		@@category_search_index = UniqueSearchIndexHelper::UniqueIndices[Constant::NodeLabel::Category][0]
		@@community_search_index = UniqueSearchIndexHelper::UniqueIndices[Constant::EntityLabel::Community][0]

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

	def self.match_in_range_with_community search_prefix
		clause = ""\
				" MATCH (genre:Genre),(community:Community) "\
				" WHERE genre." + @@genre_search_index + "=~ \'" + search_prefix + ".*\' "\
				" AND "\
				" community." + @@community_search_index + "=~ \'" + search_prefix + ".*\' "\
				" WITH genre, community "
		clause
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

	def self.exact_match_with_community limit = 1
		clause = ""\
				" WHERE genre." + @@genre_search_index + "= community." + @@community_search_index + " AND ID(genre) <> ID(community) AND NOT community:Genre "\
				" WITH community, genre LIMIT " + limit.to_s + " "
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
	def self.merge_common_community_genre_in_range search_prefix
		return_output = 0
		label = Constant::NodeLabel::Genre
		clause  = GenreHelper.match_in_range_with_community search_prefix
		clause += GenreHelper.exact_match_with_community
		clause += " WITH community AS original, genre AS duplicate "
		clause += GenericHelper::MergeNodes.merge_node_property label
		clause += GenericHelper::MergeNodes.merge_relationships label
		clause += ", LABELS(duplicate) AS label "
		clause += GenericHelper::MergeNodes.hide_duplicate label
		clause += " RETURN ID(original) AS id_orig, ID(duplicate) AS id_dup, label "
		output = clause.execute
		if output.present?
			GenericHelper::MergeNodes.set_labels output[0], label
			return_output = 1
			ELogger.log_info("Search_prefix: #{search_prefix} Genre_id: #{output[0]['id_dup']}, Community_id: #{output[0]['id_orig']}", @logfile)
		else
			ELogger.log_info("Changing Search_prefix...", @logfile)
		end
		return_output
	end

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

	def self.merge_common_community_genre
		redis_key = "community_genre_merge"
		cur_index = GenericHelper.set_up_redis_by_name redis_key
		params = { :node_label => [Constant::EntityLabel::Community, Constant::NodeLabel::Genre] }
		while cur_index.present?
			params[:prefix_search_index] = cur_index
			cur_index = GraphHelper.manage_node_pair_index_prefix params
			puts "Selected index: #{cur_index}".green
			matched   = GenreHelper.merge_common_community_genre_in_range(cur_index)
			if matched == 0
				puts " No match with #{cur_index}. Incrementing the index "
				cur_index = GraphHelper.next_regex_recursive(cur_index, cur_index.length - 1)
				$redis[redis_key] = cur_index
			end
		end
	end

	def self.merge_common_category_genre
		category_genre_redis_key = 'merge_category_genre_regex'
		@@logger = GraphHelper.log_setup category_genre_redis_key
		cur_index = ""
		if (!$redis[category_genre_redis_key].nil?)
			cur_index = $redis[category_genre_redis_key]
		else
			cur_index = "aaa"
			$redis[category_genre_redis_key] = cur_index
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
				$redis[category_genre_redis_key] = cur_index
			end
		end
	end

	def self.merge_with_category
		GenreHelper.init_variables
		GenreHelper.merge_common_category_genre
		GenreHelper.convert_category_to_genre
		GenreHelper.convert_genre_to_category
	end

	def self.merge_with_community
		@logfile = 'genre_community_merge'
		GenreHelper.init_variables
		GenreHelper.merge_common_community_genre
	end

	ConvertToCommunity = Proc.new do |params, *args|
		clause = params[:init_clause]
		clause += GenreHelper.is_not_community
		clause += GenreHelper.add_community_properties
		clause += " WITH genre "
		clause += GenreHelper.convert_edges_to_community
		clause += " WITH genre "
		clause += GenreHelper.change_labels
		clause += " RETURN MAX(ID(genre)) AS id "
		output = clause.execute
		if output.empty?
			# Don't convert edges as they are not present.(There is only one edge to convert)
			clause = params[:init_clause]
			clause += GenreHelper.is_not_community
			clause += GenreHelper.add_community_properties
			clause += " WITH genre "
			clause += GenreHelper.change_labels
			clause += " RETURN MAX(ID(genre)) AS id "
			output = clause.execute
		end
		output
	end

	def self.convert_to_community
		GenreHelper.init_variables
		params = {
			:class 			=> GenreHelper,
			:label 			=> 'Genre',
			:function 		=> GenreHelper::ConvertToCommunity,
			:function_name 	=> 'convert_to_community',
			:step_size 		=> 500
		}
		GraphHelper.iterative_entity_operations params
	end

	private

	def self.is_not_community
		" WHERE NOT genre:Community "\
		" WITH genre LIMIT 1 "
	end

	def self.add_community_properties
		search_index = UniqueSearchIndexHelper::UniqueIndices[Constant::EntityLabel::Community]
		" SET " + search_index.map{|index| ('genre.' + index + " = genre." + @@genre_search_index)}.join(", ")
	end

	def self.change_labels
		" SET genre:" + Constant::EntityLabel::Community + ": " + Constant::NodeLabel::Hidden + Constant::NodeLabel::Genre + " "\
		" REMOVE genre:" + Constant::NodeLabel::Genre + " "
	end

	def self.convert_outgoing_edges_to_community
		rel_key = RelationshipConverter.get_relation_key ['Genre'], 'Belongs_to', ['Book']
		relation_type = RelationshipConverter.get_relationship_type rel_key, 'Community'
		property_hash = RelationshipConverter.get_property rel_key, 'Community'
		if property_hash.empty?
			property_string = ""
		else
			property_string = " ON CREATE SET " + property_hash.map{|genre_property,community_property| ("new_relation." + community_property + " = " + "belongs_to." + genre_property)}.join(", ")
		end
		clause = ""\
			" MATCH (genre)-[belongs_to:Belongs_to]->(book:Book) "\
			" MERGE (genre)-[new_relation:" + relation_type + "]->(book) "\
			" " + property_string + " "
		clause
	end

	def self.convert_incoming_edges_to_community
		""
	end

	def self.convert_edges_to_community
		clause  = GenreHelper.convert_incoming_edges_to_community
		clause += GenreHelper.convert_outgoing_edges_to_community
		clause
	end

	def self.set_search_indices
		UniqueSearchIndexHelper.set_search_indices Constant::NodeLabel::Genre
		UniqueSearchIndexHelper.set_search_indices Constant::NodeLabel::Category
	end
end