module UniqueSearchIndexHelper
	UniqueIndices = {
		Constant::EntityLabel::Author 		=> ["indexed_main_author_name", "search_index"],
		Constant::EntityLabel::Book			=> [],
		Constant::EntityLabel::User 		=> [],
		Constant::EntityLabel::Community	=> ["indexed_community_name", "search_index"],
		Constant::NodeLabel::Genre	 		=> ["indexed_genre_name", "search_index"],
		Constant::NodeLabel::Category 		=> ["indexed_category_name", "search_index"]

	}

	UniqueIndexBasis = {
		Constant::EntityLabel::Author 		=> ["name"],
		Constant::EntityLabel::Book			=> ["title", "author_name"],
		Constant::EntityLabel::User 		=> [],
		Constant::EntityLabel::Community 	=> ["name"],
		Constant::NodeLabel::Genre 			=> ["name"],
		Constant::NodeLabel::Category 		=> ["name"]
	}

	ReplacementHash = {
		"-"		=> "",
		":"		=> "",
		"\'"	=> "",
		"!"		=> "",
		"["		=> "",
		"]"		=> "",
		"@"		=> "",
		"\""	=> "",
		"~"		=> "",
		"{"		=> "",
		"}"		=> "",
		"("		=> "",
		")"		=> "",
		"." 	=> "",
		","		=> "",
		"_"		=> "",
		"/"		=> "",
		"&"		=> "",
		" "		=> ""

	}

	def self.set_unique_indices_internal nodename, indices, indexbasis
		index_string = 	indexbasis.map{
			|basis| Neo.replace_string(
				ReplacementHash, nodename + "." + basis)
		}.join(" + ")
		" SET " + indices.map{|index| (nodename + "." + index + " = " + index_string)}.join(", ")
	end

	def self.set_unique_indices node_label
		clause = ""
		begin
			clause = UniqueSearchIndexHelper.set_unique_indices_internal(
				node_label.downcase,
				UniqueIndices[node_label],
				UniqueIndexBasis[node_label] )
		rescue Exception => e
			puts e.to_s.red			
		end
		clause
	end
 
	def self.set_search_indices node_label, step_size = 500
		(end_id, start_id) = Neo.get_max_min_id node_label
		params = {
			:label => node_label,
			:start_id => start_id,
			:step_size => step_size
		}
		redis_key = params[:label] + '_search_index_setter_key'
		cur_id = RedisHelper.set_up_redis redis_key, start_id
		node_batch_limit = 1000
		while cur_id <= end_id
			clause = Neo.get_nodes_with_id_range params
			clause += UniqueSearchIndexHelper.set_unique_indices params[:label]
			clause += " RETURN MAX(ID(" + node_label.downcase + ")) AS id"
			output = clause.execute
			if output.empty?
				break
			else
				cur_id = output[0]["id"]
				cur_id += 1
			end
			$redis[redis_key] = cur_id
			params[:start_id] = cur_id
		end
	end

end