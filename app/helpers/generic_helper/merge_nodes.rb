module GenericHelper::MergeNodes
	RedisKeyPrefix 	= 'merge/node/'
	LogFilePrefix	= 'merge_nodes_'

	NodeProperties =
	{
		Constant::NodeLabel::Genre => Constant::NodeLabelProperties::GenreLabel[0..-2]
	}

	MergeRelationshipParams = {
			:source_node 		=> "duplicate",
			:destination_node	=> "original",
			:with_elements 		=> [],	# fill in these
			:edge_types			=> nil	# fill in these
		}




	def self.merge params
		label 		= params[:label]
		step		= (params[:step].present?) ? params[:step] : 500
		logfile 	= LogFilePrefix + label
		redis_key = RedisKeyPrefix + label.downcase
		search_prefix = GenericHelper.set_up_redis_by_name redis_key
		params_get_prefix = 
		{
			:node_label => [label,label]
		}
		while search_prefix.present?
			params_get_prefix[:prefix_search_index] = search_prefix
			search_prefix = GraphHelper.manage_node_pair_index_prefix params_get_prefix
			clause_params = 
			{
				:prefix => search_prefix,
				:label => label,
				:step => step
			}
			clause = GenericHelper::MergeNodes.merge_clause( clause_params)
			output = clause.execute
			if output.empty?
				search_prefix = GraphHelper.next_regex_recursive(search_prefix)
			else
				GenericHelper::MergeNodes.set_labels output[0], label
				ELogger.log_info("original:" + output[0]["id_orig"].to_s + " duplicate:" + output[0]["id_dup"].to_s, logfile)
			end
		end
	end


	private
	
	def self.prefix_regex_match node, search_index, search_prefix
		" " + node + "." + search_index + " =~ \'" + search_prefix + ".*\' "
	end

	def self.duplicate search_index
		"( original." + search_index + " = duplicate." + search_index + " ) AND ID(original) <> ID(duplicate) "
	end

	def self.match_prefix_filter label, prefix
		search_index = UniqueSearchIndexHelper::UniqueIndices[label][0]
		" MATCH (original:" + label + "), (duplicate:" + label + ") "\
		" WHERE " + GenericHelper::MergeNodes.prefix_regex_match("original", search_index, prefix) + " AND " + GenericHelper::MergeNodes.prefix_regex_match("duplicate", search_index, prefix) + " "\
		" WITH original, duplicate "\
		" WHERE " + GenericHelper::MergeNodes.duplicate(search_index) + ""\
		" WITH original, duplicate "
	end

	def self.match_duplicates params
		step  			= params[:step]
		search_prefix 	= params[:prefix]
		label			= params[:label]
		clause  = GenericHelper::MergeNodes.match_prefix_filter(label, search_prefix)
		clause += " LIMIT " + step.to_s
		clause
	end

	def self.set_labels neo_output, original_label
		labels  = neo_output['label']
		id 		= neo_output['id_orig']

		labels.delete(Constant::NodeLabel::Hidden + original_label)
		label_string = labels.map{|label| (":" + label)}.join("")
		if label_string.present?
			clause = ""\
			" MATCH (node) "\
			" WHERE ID(node) = " + id.to_s + " "\
			" SET node" + label_string + " "
			clause.execute
		end
	end

	def self.merge_node_property label
		properties = NodeProperties[label]
		clause_array = []
		properties.each do |property|
			clause_array << ("original." + property + "= (CASE WHEN HAS(original." + property + ") THEN original." + property + " ELSE duplicate." + property + " END ) ")
		end
		clause  = " SET " + clause_array.join(", ")
		clause += " WITH original, duplicate "
		clause
	end

	def self.merge_relationships label
		rel_params = MergeRelationshipParams.clone
		rel_params[:edge_types] = Constant::LabelRelationships::Incoming[label]
		clause  = GenericHelper.optional_copy_incoming_edges rel_params
		rel_params[:edge_types] = Constant::LabelRelationships::Outgoing[label]
		clause += GenericHelper.optional_copy_outgoing_edges rel_params
		clause
	end

	def self.hide_duplicate label
		" REMOVE duplicate:" + label + " "\
		" SET duplicate:" + Constant::NodeLabel::Hidden + label + " "
	end


	def self.merge_clause params
		label 	= params[:label]
		clause  = GenericHelper::MergeNodes.match_duplicates params
		clause += GenericHelper::MergeNodes.merge_node_property label
		clause += GenericHelper::MergeNodes.merge_relationships label
		clause += GenericHelper::MergeNodes.hide_duplicate label
		clause += " RETURN ID(original) AS id_orig, ID(duplicate) AS id_dup, LABELS(duplicate) AS label "
		clause
	end
end