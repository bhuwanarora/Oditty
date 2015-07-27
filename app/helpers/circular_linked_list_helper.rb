module CircularLinkedListHelper
	EqualityConstraint = 'equality'
	IneqalityConstraint = 'inequality'

	def self.delete_root_links params
		clause = " MATCH (root) "\
			" WHERE ID(root) = " + params[:node_id].to_s + " "
		if params[:rel_key_value].is_a? String
			clause += " OPTIONAL MATCH (root)-[rel :" + params[:rel_type] + "{" + params[:rel_key] + ":\'" + params[:rel_key_value] + "\' }]-() "
		else
			clause += " OPTIONAL MATCH (root)-[rel :" + params[:rel_type] + "{" + params[:rel_key] + ":" + params[:rel_key_value].to_s + " }]-() "
		end
		clause += " DELETE rel "\
			" WITH root "
	end

	def self.delete_node_links params
		clause = ""
		if params[:rel_key_value].is_a? String
			clause += " OPTIONAL MATCH (node)-[rel :" + params[:rel_type] + "{" + params[:rel_key] + ":\'" + params[:rel_key_value] + "\' }]-() "
		else
			clause += " OPTIONAL MATCH (node)-[rel :" + params[:rel_type] + "{" + params[:rel_key] + ":" + params[:rel_key_value].to_s + " }]-() "
		end
		clause += " DELETE rel "
	end

	def self.select_nodes_in_order params
		clause = ""
		if params[:key_value].is_a? String
			clause += " MATCH (node {" + params[:node_key] + ": \'" + params[:node_key_value] + "\'})"
		else
			clause += " MATCH (node {" + params[:node_key] + ": " + params[:node_key_value].to_s + "})"
		end
		clause += " WHERE " + params[:labels].map{|label| (self.apply_filters(label, params))}.join(" OR ")
		clause += " WITH root, node, (CASE WHEN HAS(node.created_at) THEN node.created_at ELSE COALESCE(node.timestamp,0) END) AS created_at ORDER BY TOINT(created_at) DESC "
	end

	def self.apply_filters label, params
		clause = ""
		if params[:filters][label].present?
			clause += "(( node :" + label
			eq_constraints = params[:filters][label][EqualityConstraint]
			ineq_constraints = params[:filters][label][IneqalityConstraint]
			if eq_constraints.length > 0
				clause += ") AND ( "
				clause += eq_constraints.map{|constraint|  "node." + constraint[:key] + " = " + ((constraint[:value].is_a? String)? "\'#{constraint[:value]}\'" : constraint[:value].to_s)}.join(") AND (")
			end
			if ineq_constraints.length > 0
				clause += ') AND ('
				clause += ineq_constraints.map{|constraint|  "node." + constraint[:key] + " <> " + ((constraint[:value].is_a? String)? "\'#{constraint[:value]}\'" : constraint[:value].to_s)}.join(") AND (")
			end
			clause += "))"
		else
			clause = "( node :" + label + ' )'
		end
		clause
	end

	def self.create_self_loop params
		clause = ""\
			" MATCH (root) "\
			" WHERE ID(root) = " + params[:node_id].to_s + " AND "
		if params[:key_value].is_a? String
			clause += ""\
				" NOT (root)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":\'" + params[:rel_key_value] + "\' }]-() "\
				" CREATE UNIQUE (root)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":\'" + params[:rel_key_value] + "\' }]-(root) "
		else
			clause += ""\
				" NOT (root)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":" + params[:rel_key_value].to_s + " }]-() "\
				" CREATE UNIQUE (root)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":" + params[:rel_key_value].to_s + " }]-(root) "
		end
		clause.execute
	end

	def self.create_links params
		clause = ""\
		" WITH root, COLLECT(node) AS nodes "\
		" FOREACH (index IN RANGE(0,LENGTH(nodes) -2) | "\
			"FOREACH (s_node IN [nodes[index]] | "\
				"FOREACH (e_node IN [nodes[index + 1]] | "
		if params[:rel_key_value].is_a? String
			clause += " MERGE (s_node)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":\'" + params[:rel_key_value] + "\'}]->(e_node)) "
		else
			clause += " MERGE (s_node)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":" + params[:rel_key_value].to_s + "}]->(e_node) "
		end
		clause += ")))"\
			" WITH LAST(nodes) AS last_node, HEAD(nodes) AS head_node, root "
		if params[:rel_key_value].is_a? String
			clause += ""\
				" MERGE(last_node)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":\'" + params[:rel_key_value] + "\'}]->(root) "\
				" MERGE(root)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":\'" + params[:rel_key_value] + "\'}]->(head_node) "
		else
			clause += ""\
				" MERGE(last_node)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":" + params[:rel_key_value].to_s + "}]->(root) "\
				" MERGE(root)-[:" + params[:rel_type] + "{" + params[:rel_key] + ":" + params[:rel_key_value].to_s + "}]->(head_node) "
		end
		clause
	end

	def self.create_circular_list params
		clause  = self.delete_root_links params
		clause += self.select_nodes_in_order params
		self.delete_node_links(params).execute
		clause += self.create_links params
		clause += " RETURN ID(root) AS id"
		output = clause.execute
		if output.empty?
			output = self.create_self_loop params
		end
		output
	end

	def self.first_user_greater_than id
		clause = ""\
		" MATCH (user:User) WHERE ID(user) >= " + id.to_s + " "\
		" RETURN ID(user) AS id ORDER BY ID(user) LIMIT 1"
		query = clause.execute
		if query.empty?
			output = nil
		else
			output = query[0]["id"]
		end
		output
	end

	def self.reset_feednext_circular_list
		temp = User.get_max_min_id.execute
		max_id = temp[0]["max_id"]
		min_id = temp[0]["min_id"]
		redis_key = 'feednext_reset'
		$redis[redis_key] = 0
		cur_id = RedisHelper.set_up_redis redis_key, min_id
		params = {
			:rel_type => 'FeedNext',
			:labels => ['FollowsNode', 'BookmarkNode', 'StatusNode ', 'EndorseNode', 'RatingNode'],
			:filters => {'BookmarkNode' =>
							{IneqalityConstraint =>
								[{:key => 'key', :value => 'Visited'}, {:key => 'key', :value =>'FromFacebook'}],
							EqualityConstraint => []
							}
						 },
			:node_key => 'user_id',
			:rel_key => 'user_id',
			:node_key_value => 0,
			:rel_key_value => 0,
			:node_id => 0
		}
		while cur_id <= max_id
			cur_id = self.first_user_greater_than cur_id
			if cur_id.nil?
				break
			end
			params[:node_key_value] = cur_id
			params[:rel_key_value] = cur_id
			params[:node_id] = cur_id
			output = self.create_circular_list params
			$redis[redis_key] = cur_id
			cur_id += 1
		end

	end

	def self.stringify value
		output = ""
		if value.is_a? String
			output = "\'" + value.database_ready + "\'"
		else
			output = value.to_s
		end
		output
	end

	def self.remove_element_from_one_list rel_label, key_properties, with_elems
		rel_filter = (key_properties.empty?)? "": (" WHERE " + key_properties.map{|property| ( "left_rel." + property + "=" + "right_rel".property )}.join(" AND "))

		rel_output_property = (key_properties.empty?)? "": (key_properties.map{|property| (property + ":" + "left_rel." + property)}.join(", "))

		" OPTIONAL MATCH (left_node)-[left_rel:" + rel_label + "]->(node)-[right_rel:" + rel_label + "]->(right_node) "\
		" " + rel_filter + " "\
		" WITH COLLECT([left_node,right_node]) AS nodes, left_rel, right_rel " + with_elems.map{|elem| (elem)}.join(", ") + " "\
		"" + Neo.delete_element_optional_match('left_rel') + Neo.delete_element_optional_match('right_rel') + " "\
		" FOREACH (elem in (CASE WHEN nodes[1] IS NULL THEN [] ELSE nodes END )| "\
			"FOREACH (node1 IN [elem[0]] | "\
				" FOREACH (node2 IN [elem[1]] | "\
					" MERGE (left_node)-[:" + rel_label + rel_output_property + "]->(right_node) "\
				")"\
			")"\
		")"\
		" WITH " + with_elems.map{|elem| (elem)}.join(", ")
	end

	def self.remove_element_with_id id, relationship, with_elems
		clause = " MATCH (node) "\
				" WHERE ID(node) = " + id.to_s + " "\
				" WITH node "
		clause += CircularLinkedListHelper.remove_element relationship, with_elems
	end

	def self.remove_element relationship, with_elems = ['node']
		clause += relationship.map{|label,key_properties| (CircularLinkedListHelper.remove_element_from_one_list(label, key_properties))}.join("")
	end
end