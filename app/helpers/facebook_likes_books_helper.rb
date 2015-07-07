module FacebookLikesBooksHelper
	
	def self.set_community_books node_id
		text_array = self.get_data_for_NLP node_id
		text = self.concatenate_hash text_array
		community_books_relevance = self.get_communities_from_text [text]
		default_community_books_relevance = self.get_communities_from_default node_id
		debugger
		all_community_books_relevance = community_books_relevance[0] + default_community_books_relevance
		self.merge_community_to_books all_community_books_relevance
		self.merge_node_to_community all_community_books_relevance, node_id
		self.clean_up node_id
		debugger
	end

	def self.clean_up node_id
		clause = self.match_rel(node_id, FacebookLike.get_relationship_type("category_list")) + " RETURN ID(destination) AS id, destination.name AS name "
		ids = clause.execute
		ids.each do |category|
			clause = Community.search_by_index(category["name"]) + self.match_node(node_id) + ", community "
			clause += " MERGE(node)-[:" + FacebookLike.get_relationship_type("category_list") + "]->(community) WITH node "
			clause += " MATCH (node)-[r:" + FacebookLike.get_relationship_type("category_list") + "]->(to_be_deleted) WHERE ID(to_be_deleted) = " + category["id"].to_s + " DELETE to_be_deleted, r"
			clause.execute
		end
	end

	def self.merge_community_to_books all_community_books_relevance
		all_community_books_relevance.each do |element|
			books_id = element['books_id']
			name 	= element['name']
			clause = Community.merge(name)
			books_id.each do |book_id|
				clause +=  self.match_node(book_id,"book") + ", community " + Community.merge_book + " WITH community "
			end
			(clause + " RETURN ID(community)").execute
		end
	end

	def self.merge_node_to_community all_community_books_relevance, node_id
		clause = self.match_node(node_id)
		all_community_books_relevance.each do |element|
			clause += Community.merge(element['name']) + ", node " + News.merge_community({
										'relevance' =>element['relevance'],
										'relevanceOriginal' => element['relevanceOriginal']
										},'node')
			clause += " WITH node "
		end
		clause += " RETURN ID(node)"
		clause.execute
	end

	def self.match_node id, nodename = "node"
		" MATCH(" + nodename + ") WHERE ID(" + nodename + ") = " + id.to_s + " WITH " + nodename + " "
	end

	def self.match_rel id_src, rel_type, src_name = "node"
		" MATCH(" + src_name + ")-[rel:" + rel_type + "]-(destination) WHERE ID(" + src_name + ") = " + id_src.to_s + " WITH rel, destination, " + src_name + " "
	end

	def self.match_fb_node app_id, nodename = "node"
		" MATCH(" + nodename + ") WHERE " + nodename + ".app_id = " + "\"" + app_id.to_s + "\" WITH " + nodename + " "
	end

	def self.merge_node label, properties
		clause = " MERGE (node"
		clause += (label.map{|label_single| (":" + label_single + " ")}).join
		if(properties["id"].present?)
			clause += "{ app_id: \"" + properties["id"] + "\"})  ON CREATE SET node.created_at = " + Time.now.to_i.to_s + ", node.updated_at = " + Time.now.to_i.to_s + " ON MATCH SET node.updated_at = " + Time.now.to_i.to_s + " WITH node SET "
			properties.each do |key,value|
				if key == 'id'
					next
				end
				clause += " node." + key + " = \"" + value + "\","
			end
			clause[clause.length - 1] = ''
		else
			clause += "{"
			properties.each do |key,value|
				clause += " " + key + ": \"" + value.to_s + "\","
			end
			clause[clause.length - 1] = '}'
			clause += ') '
			clause += " ON CREATE SET node.created_at = " + Time.now.to_i.to_s + ", node.updated_at = " + Time.now.to_i.to_s + " ON MATCH SET node.updated_at = " + Time.now.to_i.to_s + " "
		end
		clause
	end

	def self.merge_relationship source_id, dest_id, type, properties = nil
		if(properties.nil?)
			properties = []
		end
		clause = self.match_node(source_id) + "AS source " + self.match_node(dest_id) + "AS destination, source "\
		" MERGE (source)-[:" + type
		if(properties.length > 0 )
			clause += "{ "
			properties.each do |key,value|
				clause += " " + key + ": " + value.to_s + ","
			end
			clause[length -1] = '}'
		end
		clause += "]->(destination) "
	end

	def self.handle_hash properties, key, default_label
		child_node_property = properties
		child_node_relationship_label =FacebookLike.get_relationship_type key
		child_node_label = default_label
		{:label => child_node_label,
		:relationship_label => child_node_relationship_label,
		:property => child_node_property}
	end

	def self.handle_array properties, key, default_label
		properties.map {|property| self.handle_hash(property,key,default_label)}
	end

	def self.handle_each_param param, key, node_label
		children_node_set = []
		node_property = nil
		if param.is_a?(Hash)
			children_node_set << self.handle_hash(param, key, [FacebookLike.get_node_label(key)])
		elsif param.is_a?(Array)
			if(key == "category_list")
				output = self.handle_array(param, key, ["Community"])
			else
				output = self.handle_array(param, key, [FacebookLike.get_node_label(key)])
			end
			output.each {|element| children_node_set << element}
		elsif param.to_s != Constant::FbDataNode::FbNullProperty
			node_property = param.to_s
			if is_separate_node_needed? key, node_label
				children_node_set << {
									:label => [self.get_custom_label_fb_data_node(key)],
									:relationship_label => FacebookLike.get_relationship_type(key),
									:property => {key => param}
									}
			end
		end
		{:children_node_set => children_node_set, :node_property => node_property}
	end

	def self.handle_children node_id, children_node_set
		children_id_set = []
		if children_node_set.length > 0
			clause = ""
			children_node_set.each do |child_node|
				child_id = set_node_property_recursive(child_node[:property], child_node[:label])
				clause += merge_relationship(node_id,child_id,child_node[:relationship_label])
				clause += " WITH ID(source) AS ignore "
				children_id_set << child_id
			end
			clause += " RETURN ignore AS id "
			clause.execute
		end
		children_id_set
	end

	def self.set_node_property_recursive params, parent_category
		app_id = params["id"]
		clause = match_fb_node app_id
		children_node_set = []
		node_property = {}
		if(params["category"].present?)
			node_label = params["category"].split("/").map{|category_single| FacebookLike.get_node_label category_single}
		else
			node_label = parent_category
		end
		params.keys.each do |key|
			output = handle_each_param params[key], key, node_label
			children_node_set += output[:children_node_set]
			if !output[:node_property].blank?
				node_property[key] = output[:node_property]
			end
		end
		clause = self.merge_node(node_label, node_property) + "RETURN ID(node) AS id"
		node_id = clause.execute[0]["id"]
		children_id_set = self.handle_children node_id, children_node_set
		self.handle_location children_node_set, children_id_set
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
			if(child[:label].length == 1 ) # to avoid uninteded cases.
				if(child[:label][0] == Constant::FbDataNode::FbDataNodeToLabel["country"])
					country_id = children_id_set[index]
				elsif(child[:label][0] == Constant::FbDataNode::FbDataNodeToLabel["city"])
					city_id = children_id_set[index]
				elsif(child[:label][0] == Constant::FbDataNode::FbDataNodeToLabel["street"])
					street_id = children_id_set[index]
				end
			end
		end
		clause = ""
		if(country_id.present?)
			if(city_id.present?)
				clause += LocationHierarchyHelper.merge_country_to_city_id(country_id,city_id)
				clause += " WITH country "
			elsif(street_id.present?)
				clause += LocationHierarchyHelper.merge_country_to_street_id(country_id, street_id)
				clause += " WITH country "
			end
		end
		if(city_id.present?)
			if(street_id.present?)
				clause += LocationHierarchyHelper.merge_city_to_street_id(city_id, street_id)
				clause += " WITH city "
			end
		end
		if(clause.length > 0)
			clause += " RETURN ID(city) "
			clause.execute
		end
	end

	def self.is_separate_node_needed? key, node_label
		(Constant::FbDataNode::FbDataNodeToLabel.keys.include? key) && (node_label.length > 1 || !((node_label.include? self.get_custom_label_fb_data_node(key))))
	end

	def self.get_custom_label_fb_data_node key
		Constant::FbDataNode::FbDataNodeToLabel[key]
	end

	def self.get_data_for_NLP node_id
		clause = self.match_node(node_id) + " RETURN "
		Constant::FbDataNode::FbNlpDescriptionPropertiesPrimary.each do |property|
			clause += " node." + property + " AS " + property + ","
		end
		clause[clause.length - 1] = ''
		clause.execute[0]
	end

	def self.get_communities_from_text text_array
		text_array.map{|text| self.get_communities_from_NLP(text)}
	end

	def self.get_default_communities_from_node node_id
		clause = self.match_node(node_id) + "RETURN "
		link_types = []
		Constant::FbDataNode::FbDefaultCommunities.each do |property|
			unless property[property.length - 1] == '/'
				clause += " node." + property + " AS " + property + ","
			else
				link_types << FacebookLike.get_relationship_type(property[0,property.length - 1])
			end
		end
		clause[clause.length - 1] = ''
		output = clause.execute
		communitynames = []
		if(output.length > 0)
			community_info = output[0]
			community_info.each do |key,community|
				if(community.present?)
					communitynames += community.split("/")
				end
			end
		end
		communitynames.map{|communityname| {
									'name'		=> communityname,
									'relevance' => Constant::FbDataNode::FbDefaultCommunityRelevance,
									'relevanceOriginal' => Constant::FbDataNode::FbDefaultCommunityRelevance,
									'books_id' => CommunitiesHelper.fetch_book_ids(communityname)[communityname]}}
	end

	def self.get_default_communities_from_rel node_id
		clause = self.match_rel(node_id, FacebookLike.get_relationship_type("category_list")) + "RETURN destination.name AS name"
		communitynames = clause.execute.map{|elem| elem["name"]}
		communitynames.map{|communityname| {
									'name'		=> communityname,
									'relevance' => Constant::FbDataNode::FbDefaultCommunityRelevance,
									'relevanceOriginal' => Constant::FbDataNode::FbDefaultCommunityRelevance,
									'books_id' => CommunitiesHelper.fetch_book_ids(communityname)[communityname]}
											}
	end

	def self.get_communities_from_default node_id
		c1 = self.get_default_communities_from_node node_id
		c2 = self.get_default_communities_from_rel node_id
		c1 + c2
	end

	def self.get_communities_from_NLP text
		uri= URI.parse(Rails.application.config.nlp_service + "api/v0/get_community")
		response = Net::HTTP.post_form(uri, {"q" => text})
		community_books_relevance = CommunitiesHelper.handle_nlp_response response
	end

	def self.concatenate_hash dict, joining_string = " "
		output = ""
		dict.each do |key,value|
			if(value.present?)
				output += dict[key].to_s + joining_string
			end
		end
		output = output[0, output.length - joining_string.length]
	end
end