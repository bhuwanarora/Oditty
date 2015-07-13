module SuperCommunitiesHelper
	
	def self.logger
		@@sc_logger ||= Logger.new("#{Rails.root}/log/supercommunity.log")
	end

	def self.get_community_info_for_supercommunity
		super_community_to_c_relation = 'RootOf'
		" MATCH (supercommunity)-[:" + super_community_to_c_relation + "]->(community:Community) "\
		" RETURN community, supercommunity.name AS name, ID(supercommunity) AS id "
	end

	def self.set_community_info_for_supercommunity formatted_data
		clause = " MATCH (supercommunity:SuperCommunity)"\
			" WHERE ID(supercommunity) = " + formatted_data[:id].to_s + " "\
			" SET "
		formatted_data[:property].each do |key, property|
			if(property.present?)
				if(property.is_a? String)
					clause += " supercommunity." + key + " = \"" + property.to_s + "\","
				else
					clause += " supercommunity." + key + " = " + property.to_s + ","
				end
			end
		end
		clause += " " + "supercommunity.indexed_community_name = \"" + formatted_data[:name].search_ready + "\" "
		clause.execute
	end

	def self.set_up_redis key, start_id
		cur_id = 0
		if(!$redis[key].nil?)
			cur_id = $redis[key].to_i
		else
			cur_id = start_id
			$redis[key] = cur_id -1
		end
		self.logger.info(" Starting the handling of supercommunity from id #{cur_id}")
		cur_id
	end
	
	def self.get_max_min_id label
		output = ("MATCH (a:" + label + ") RETURN max(ID(a)) as max_id,min(ID(a)) as min_id").execute[0]
		[output["max_id"],output["min_id"]]
	end

	def self.match_super_community lower_limit_id
		super_community_label = 'SuperCommunity'
		super_community_to_c_relation = 'RootOf'
		clause = "MATCH (supercommunity:" + super_community_label + ")-[:" + super_community_to_c_relation + "]->(community:Community) "\
				" WHERE ID(supercommunity) >= " + lower_limit_id.to_s + ""\
				" WITH supercommunity ORDER BY ID(supercommunity) LIMIT 1 "
	end

	def self.get_formatted_data_from_nodes neo4jresponse
		if !neo4jresponse.empty?
			sc_name = neo4jresponse[0]["name"]
			sc_id = neo4jresponse[0]["id"]
			propertset = {}
			neo4jresponse.each do |response|
				community = response["community"]["data"]
				if(propertset.keys.empty?)
					if(community["name"] == sc_name)
						community.each {|key,prop| propertset[key] = prop}
					end
				else
					community.each do |key,prop| 
						if propertset[key].nil?
							propertset[key] = prop
						end
					end
				end
			end
		else
			sc_name = nil
			sc_id = nil
			propertset = []
		end
		{:name => sc_name, :id => sc_id, :property => propertset}
	end

	# Setting view_count, importance, follow_count
	# created_at, updated_at
	def self.supercommunity_handle_special_properties
		super_community_to_c_relation = 'RootOf'
		clause = " OPTIONAL MATCH (supercommunity)<-[:HasCommunity]-(news:News) "\
				" WITH supercommunity, COUNT(news) AS importance "\
				" SET supercommunity.importance = importance "\
				" WITH supercommunity "\
				""\
				" OPTIONAL " + UsersCommunity.match("supercommunity") + " "\
				" WITH COUNT(user) AS follow_count, supercommunity "\
				" SET supercommunity.follow_count = follow_count "\
				" WITH supercommunity "\
				""\
				" MATCH (supercommunity)-[:" + super_community_to_c_relation + "]-(community) "\
				" WITH supercommunity, SUM(community.view_count) AS view_count, MIN(community.created_at) AS created_at "\
				" SET supercommunity.view_count = view_count, "\
					" supercommunity.created_at = COALESCE(created_at," + Time.now.to_i.to_s + "), "\
					" supercommunity.updated_at = " + Time.now.to_i.to_s + " "
	end

	def self.set_node_info cur_id, end_id
		clause = self.match_super_community cur_id
		clause += self.get_community_info_for_supercommunity
		output = self.get_formatted_data_from_nodes clause.execute
		if output[:id].nil?
			self.logger.info(" No more supercommunity with id >= #{cur_id} ")
			cur_id = end_id + 1
		else
			cur_id = output[:id]
		end
		self.set_community_info_for_supercommunity output
		cur_id
	end

	def self.delete_edges relationship_type, nodename
		" MATCH (" + nodename + ")-[r:" + relationship_type + "]-() "\
		" DELETE r"
	end

	def self.merge_edges node_id
		rel_left = {"HasCommunity" => '<', "OfCommunity" => '<', 
					"RelatedBooks" => '', "HasVideo" => ''}
		
		rel_right = {"HasCommunity" => '', "OfCommunity" => '', 
					"RelatedBooks" => '>', "HasVideo" => '>'}
		
		relationship = ["HasCommunity", "OfCommunity", "RelatedBooks", "HasVideo"]
		clause = " MATCH (supercommunity:SuperCommunity)-[:RootOf]->(community:Community) "\
				" WHERE ID(supercommunity) = " + node_id.to_s + " "\
				" WITH supercommunity, community "
		relationship.each do |rel_type|
			clause += " OPTIONAL MATCH (community)" + rel_left[rel_type] + "-[relationship:" + rel_type + "]-" + rel_right[rel_type] + "(node) "\
				" WITH supercommunity, community, COLLECT(node) AS nodes "\
				" FOREACH (node IN nodes | "\
					" MERGE(supercommunity)" + rel_left[rel_type] + "-[:" + rel_type + "]-" + rel_right[rel_type] + "(node) "\
					")"\
				" WITH supercommunity, community, nodes"\
				" FOREACH (node IN nodes| "\
					" FOREACH (node_s IN (CASE WHEN HAS(node.community_id) THEN [node] ELSE [] END) |"\
						" SET node_s.community_id = ID(supercommunity), "\
						" node_s.old_community_id = ID(community) ))"\
				" WITH community, supercommunity "\
		end
		clause += " SET supercommunity :Community, community :" + Constant::Label::HiddenCommunity + ""\
			" REMOVE community :Community "\
			" WITH community, supercommunity "\
			" MATCH (community)-[rel]-(node)-[]-(supercommunity) "\
				" WHERE HAS(node.community_id) "\
				" DELETE rel "\
			" RETURN ID(supercommunity) AS id "
		clause
	end

	def self.set_special_props node_id
		clause = " MATCH (supercommunity:SuperCommunity) "\
			" WHERE ID(supercommunity) = " + node_id.to_s + " "\
			" " + self.supercommunity_handle_special_properties + " "\
			" RETURN ID(supercommunity) AS id "
		id = clause.execute
		if id.empty?
			self.logger.info(" set_special_props failed for ID: #{node_id}")
		end
	end

	def self.handle_super_communities
		begin
			(end_id,start_id) = self.get_max_min_id "SuperCommunity"
			supercommunity_key = "supercommunity_helper_key"
			cur_id = self.set_up_redis supercommunity_key, start_id
			while cur_id <= end_id
				cur_id = self.set_node_info cur_id, end_id
				if (cur_id <= end_id)
					(self.merge_edges cur_id).execute
					self.set_special_props cur_id
				end
				cur_id += 1
				$redis[supercommunity_key] = cur_id
			end
		rescue Exception => e
			self.logger.info(e.to_s)
		end
	end

	def self.merge_two_communities destroy_community, prevail_community
		clause = " MATCH (supercommunity) "\
			" WHERE ID(supercommunity) = " + prevail_community[:id].to_s + " "\
			" SET supercommunity:SuperCommunity "\
			" WITH supercommunity "\
			" MATCH (community:Community) "\
			" WHERE ID(community) = " + destroy_community[:id].to_s + " AND NOT (community)-[:RootOf]-() "\
			" MERGE (supercommunity)-[:RootOf]->(community) "\
			" WITH community "
		clause += self.merge_edges prevail_community[:id]
		clause.execute
		self.set_special_props prevail_community[:id]
		clause = " MATCH (supercommunity:SuperCommunity)-[rootof:RootOf]-() "\
			" WHERE ID(supercommunity) = " + prevail_community[:id].to_s + " "\
			" WITH supercommunity, COUNT(rootof) AS roots "\
			" WHERE roots = 1"\
			" MATCH (supercommunity:SuperCommunity)-[rootof:RootOf]-() "\
			" WHERE NOT HAS(rootof.score) "\
			" REMOVE supercommunity: SuperCommunity "\
			" DELETE rootof "
		clause.execute
	end

	def self.handle_new_community community_info
		begin
			id = community_info["id"]
			name = community_info["name"]
			wiki_info = WikiHelper.obtain_wiki_similar_community name
			if wiki_info[:fromdb] && id != wiki_info[:id]
				prevail_community = wiki_info
				destroy_community = {:name => name, :id => id, :url => wiki_info[:url]}
				self.merge_two_communities destroy_community, prevail_community
			end
		rescue Exception => e
			puts e.to_s.red
		end
	end

	def self.merge_multiple_communities communities_info
		if communities_info.length > 1
			prevail_community = {:id => communities_info[0]["id"]}
			communities_info.each_with_index do |community_info,index|
				if index > 0
					self.merge_two_communities({:id => community_info["id"]}, prevail_community)
				end
			end
		end
	end

	def self.handle_new_communities
		birth_time = 1434758400 #20 July 2015
		clause = " MATCH (c:Community) WHERE c.created_at > " + birth_time.to_s + " AND NOT c:SuperCommunity RETURN ID(c) AS id, c.name AS name "
		communities_info = clause.execute
		communities_info.each{|community_info| handle_new_community(community_info)}
	end
end