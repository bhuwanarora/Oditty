module FacebookLikesBooksHelper
	
	def self.set_community_books node_id
		text_array = FacebookLikesBooksHelper.get_data_for_NLP node_id
		text = text_array.join(" ")
		community_books_relevance = FacebookLikesBooksHelper.get_communities_from_text [text]
		default_community_books_relevance = FacebookLikesBooksHelper.get_communities_from_default node_id
		all_community_books_relevance = community_books_relevance[0] + default_community_books_relevance
		FacebookLikesBooksHelper.merge_community_to_books all_community_books_relevance
		FacebookLikesBooksHelper.merge_node_to_community all_community_books_relevance, node_id
	end

	def self.merge_community_to_books all_community_books_relevance
		all_community_books_relevance.each do |element|
			books_id = element['books_id']
			name 	= element['name']
			clause = Community.merge(name)
			books_id.each do |book_id|
				clause +=  FacebookLikesBooksHelper.match_node(books_id,"book") + ", community " + Community.merge_book + " WITH community "
			end
			(clause + " RETURN ID(community)").execute
		end
	end

	def self.merge_node_to_community all_community_books_relevance, node_id
		clause = FacebookLikesBooksHelper.match_node(node_id)
		all_community_books_relevance.each do |element|
			clause += Community.merge(element['name']) + ", node " + News.merge_community({
										'relevance' =>element['relevance'],
										'relevanceOriginal' => element['relevanceOriginal']
										},'node')
			clause += " WITH node "
		end
		clause.execute
	end

	def self.match_node id, nodename = "node"
		" MATCH(" + nodename + ") WHERE ID(" + nodename + ") = " + id.to_s + " WITH " + nodename + " "
	end

	def self.merge_node label, properties
		clause = "MERGE (node:" + label + "{"
		properties.each do |key,value|
			clause += " " + key + ": " + value.to_s + ","
		end
		clause[clause.length -1] = '}'
	end

	def self.merge_relationship source_id, dest_id, type, properties = nil
		if(properties.nil?)
			properties = []
		end
		clause = FacebookLikesBooksHelper.match_node(source_id) + "AS source " + FacebookLikesBooksHelper.match_node(dest_id) + "AS destination, source "\
		" MERGE (source)-[:" + type + "{ "
		properties.each do |key,value|
			clause += " " + key + ": " + value.to_s + ","
		end
		clause[length -1] = '}'
		clause += "->(destination) "
	end

	def self.handle_hash properties, key, default_label
		child_node_property = properties
		child_node_relationship_label =FacebookLike.get_relationship_type key
		child_node_label = node_label
		{:label => child_node_label,
		:relationship_label => child_node_relationship_label,
		:property => child_node_property}
	end

	def self.handle_array properties, key, default_label
		properties.map {|property| FacebookLikesBooksHelper.handle_hash(property,key,default_label)}
	end

	def self.handle_each_param param, key, node_label
		children_node_set = []
		node_property = nil

		if param.is_a?(Hash)
			children_node_set << FacebookLikesBooksHelper.handle_hash(params, key, node_label)
		elsif param.is_a?(Array)
			output = FacebookLikesBooksHelper.handle_array(param, key, node_label)
			output.each {|element| children_node_set << element}
		else
			node_property = param
			if is_separate_node_needed? key
				children_node_set << {
									:label => FacebookLikesBooksHelper.get_custom_label_fb_data_node(key),
									:relationship_label => FacebookLike.get_relationship_type(key),
									:property => {key => param}
									}
			end
		end
		{:children_node_set => children_node_set, :node_property => node_property}
	end

	def self.handle_children children_node_set
		clause = ""
		children_id_set = []
		children_node_set.each do |child_node|
			child_id = set_node_property_recursive(child_node[:property], child_node[:label])
			clause += merge_relationship(node_id,child_id,child_node[:relationship_label])
			children_id_set << child_id
		end
		clause.execute
		children_id_set
	end

	def self.set_node_property_recursive params, parent_category
		clause = match_node node_id
		children_node_set = []
		node_property = {}
		node_label = FacebookLike.get_node_label params["category"]
		if (node_label.nil?)
			node_label = parent_category
		end
		params.keys.each do |key|
			output = handle_each_param params[key], key, node_label
			children_node_set += output[:children_node_set]
			if !output[:node_property].nil
				node_property[key] = output[:node_property]
			end
		end
		clause = FacebookLikesBooksHelper.merge_node(node_label, node_property) + "RETURN ID(node) AS id"
		node_id = clause.execute[0]["id"]
		children_id_set = FacebookLikesBooksHelper.handle_children children_node_set
		FacebookLikesBooksHelper.handle_location children_node_set, children_id_set
		node_id
	end

	#Semantics: if there will be a link from every top hierarchy to its first bottom
	
	# if country is present and city is present then
	# 		(country)-[:HasCity]->(city)

	# if country is present and city is absent then
	# 		(country)-[:HasStreet]->(street)

	def self.handle_location children_set, children_id_set
		country_id = nil
		city_id = nil
		street_id = nil
		children_set.each_with_index do |child,index|
			if(children_set[:label] == FbDataNodeToLabel["country"])
				country_id = children_id_set[index]
			elsif(children_set[:label] == FbDataNodeToLabel["city"])
				city_id = children_id_set[index]
			elsif(children_set[:label] == FbDataNodeToLabel["street"])
				street_id = children_id_set[index]
			end
		end
		clause = ""
		if(country_id.present?)
			if(city_id.present?)
				clause += LocationHierarchyHelper.merge_country_to_city_id(country_id,city_id)
			elsif(street_id.present)
				clause += LocationHierarchyHelper.merge_country_to_street_id(country_id, street_id)
			end
		end
		if(city_id.present?)
			if(street_id.present)
				clause += LocationHierarchyHelper.merge_city_to_street_id(city_id, street_id)
			end
		end
		clause.execute
	end

	def self.is_separate_node_needed? key
		Constant::FbDataNode::FbDataNodeToLabel.keys.include? key
	end

	def self.get_custom_label_fb_data_node key
		Constant::FbDataNode::FbDataNodeToLabel[key]
	end

	def self.get_data_for_NLP node_id
		clause = FacebookLikesBooksHelper.match_node(node_id) + " RETURN "
		Constant::FbDataNode::FbNlpDescriptionPropertiesPrimary.each do |property|
			clause += " node." + property + "AS " + property + ","
		end
		clause[clause.length -1] = ''
		clause.execute[0]
	end

	def self.get_communities_from_text text_array
		text_array.map{|text| FacebookLikesBooksHelper.get_communities_from_NLP(text)}
	end

	def self.get_communities_from_default node_id
		clause = FacebookLikesBooksHelper.match_node(node_id) + "RETURN "
		link_types = []
		Constant::FbDataNode::FbDefaultCommunities.each do |property|
			unless property[property.length -1] == '/'
				clause += " node." + property + ","
			else
				link_types << FacebookLike.get_relationship_type(property)
			end
		end
		clause[clause.length -1] = ''
		output = clause.execute
		communitynames = []
		if(output.length > 0)
			community_info = output[0]
			community_info.each do |key,community|
				communitynames += community.split("/")
			end
		end
		communitynames.map{|communityname| {'name'		=> communityname,
									'relevance' => Constant::FbDataNode::FbDefaultCommunityRelevance,
									'relevanceOriginal' => Constant::FbDataNode::FbDefaultCommunityRelevance,
									'books_id' => CommunitiesHelper.fetch_book_ids(communityname)[communityname]}}
	end

	def self.get_communities_from_NLP text
		uri= URI.parse(Rails.application.config.nlp_service + "api/v0/get_community")
		response = Net::HTTP.post_form(uri, {"q" => text})
		community_books_relevance = CommunitiesHelper.handle_nlp_response response
	end
end