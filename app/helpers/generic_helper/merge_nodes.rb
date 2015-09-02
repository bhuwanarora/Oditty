module GenericHelper::MergeNodes
	RedisKeyPrefix = 'merge/node/'
	NodeProperties = {
		Constant::EntityLabel::Genre => []
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

	def self.merge_node_property label

	end

	def self.merge_clause params
		label 			= params[:label]
		
		clause  = GenericHelper::MergeNodes.match_duplicates params
		clause += GenericHelper::MergeNodes.merge_node_property label
		clause += GenericHelper::MergeNodes.merge_relationships label
		clause
	end
end