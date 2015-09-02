module GenericHelper::MergeNodes
	RedisKeyPrefix = 'merge/node/'

	NodeProperties =
	{
		Constant::EntityLabel::Genre => Constant::NodeLabelProperties::GenreLabel[0..-2]
	}

	NodeRelationShips =
	{
		Constant::EntityLabel::Genre
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

		redis_key = RedisKeyPrefix + label.downcase
		search_prefix = GenericHelper.set_up_redis_by_name redis_key
		params_get_prefix = 
		{
			:node_label => [label,label]
		}
		while search_prefix.present?
			params_get_prefix[:prefix_search_index] = search_prefix
			search_prefix = GraphHelper.manage_node_pair_index_prefix
			clause_params = 
			{
				:prefix => search_prefix,
				:label => label
				:step => step
			}
			clause = GenericHelper::MergeNodes.merge_clause( clause_params)
			output = clause.execute
			if output.empty?
				search_prefix = GraphHelper.next_regex_recursive(search_prefix)
			end
		end
	end


	private
	
	def self.prefix_regex_match node, search_index, search_prefix
		" " + node + "." + search_index + " =~ \'" + search_prefix + "\' "
	end

	def self.duplicate search_index
		"( original." + search_index + " = duplicate." + search_index + " )"
	end

	def self.match_prefix_filter label, prefix
		search_index = UniqueSearchIndexHelper::UniqueIndices[label][0]
		" MATCH (original:" + label + "), (duplicate:" + label + ") "\
		" WHERE " + GenericHelper::MergeNodes.prefix_regex_match("original", search_index, prefix) + " AND " + GenericHelper::MergeNodes.prefix_regex_match("duplicate", search_index, prefix) + " AND ID(original) <> ID(duplicate) "\
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

	def self.copy_labels
		" WITH original, duplicate, LABELS(duplicate) AS labelset "\
		" FOREACH ( label IN labelset | "\
			" SET original :label "\
		" ) "\
		" WITH original, duplicate "
	end

	def self.merge_node_property label
		properties = NodeProperties[label]
		clause_array = []
		properties.each do |property|
			clause_array << ("original." + property + "= (CASE WHEN HAS(original." + property + ") THEN original." + property + " ELSE duplicate." + property + ") ")
		end
		clause = " SET " + clause_array.join(", ")
		clause
	end

	def self.merge_nodes
		clause  = GenericHelper::MergeNodes.copy_labels
		clause += GenericHelper::MergeNodes.merge_node_property
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


	def self.merge_clause params
		label 	= params[:label]
		clause  = GenericHelper::MergeNodes.match_duplicates params
		clause += GenericHelper::MergeNodes.merge_nodes label
		clause += GenericHelper::MergeNodes.merge_relationships label
		clause
	end
end