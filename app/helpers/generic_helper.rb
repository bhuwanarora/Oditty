module GenericHelper
	def self.set_up_redis label, key
		(max_id,min_id) = Neo.get_max_min_id label
		cur_id = RedisHelper.set_up_redis key, min_id
		{:cur_id => cur_id, :max_id => max_id}
	end

	def self.set_up_redis_by_name key, init_depth = 3
		init_string = Array.new(init_depth) { 'a' }.join
		RedisHelper.update_value key, init_string
		init_string
	end

	def self.update_redis key, value
		RedisHelper.update_value key, value
	end

	def self.get_files_in_directory directory, file_regex = '*'
		Dir[directory + "/" + file_regex]
	end

	def self.recursively_create_directories directory
		require 'fileutils'
		FileUtils.mkdir_p directory
	end

	def self.optional_copy_edges relation_param, direction
		relation 			= relation_param[:edge_types]
		clause 				= " "
		relation.each do |edge_info|
			edge_info = edge_info.clone.merge({:direction => direction})
			params = relation_param.clone.merge({:edge_info => edge_info})
			clause += GenericHelper.handle_each_edge_type params
		end
		clause
	end

	#necessary keys present in relation_param
	# edge_types => 		hash with keys as TYPE of edge and value as a hash describing edge
	# source_node => 		node from which relations are to be copied
	# destination_node =>	node to which relations will be copied
	# with_elements	=>		any element which needs to be carried through
	def self.optional_copy_outgoing_edges relation_param
		GenericHelper.optional_copy_edges relation_param, Constant::LabelRelationships::OutgoingRel
	end

	#necessary keys present in relation_param
	# edge_types => 		hash with keys as TYPE of edge and value as a hash describing edge
	# source_node => 		node from which relations are to be copied
	# destination_node =>	node to which relations will be copied
	# with_elements	=>		any element which needs to be carried through
	def self.optional_copy_incoming_edges relation_param
		GenericHelper.optional_copy_edges relation_param, Constant::LabelRelationships::IncomingRel
	end

	private
	def self.handle_each_edge_type params
		edge_info 			= params[:edge_info]
		source_node 		= params[:source_node]
		destination_node 	= params[:destination_node]
		with_elems 			= params[:with_elements] + [source_node, destination_node]

		with_elems_string	= " WITH DISTINCT " + with_elems.map{|elem| (elem)}.join(", ")
		clause  = GenericHelper.copy_edges_clause(edge_info, source_node, destination_node)
		clause += with_elems_string + " "
	end

	def self.copy_edges_clause edge_info, source_node, destination_node
		edge_type 		= edge_info[:type]
		node_labels		= edge_info[:label]
		properties		= edge_info[:property]
		direction 		= edge_info[:direction]
		property_string = properties.map{|property| ("new_rel." + property + "= (CASE WHEN old_rel IS NULL THEN null ELSE old_rel." + property + " END )")}.join(", ")
		node = node_labels.map{|label| label.downcase}.join("") + "_" + String.get_random
		label_string = node_labels.map{|label| (":" + label)}.join
		if direction == Constant::LabelRelationships::OutgoingRel
			clause = " "\
				" OPTIONAL MATCH (" + source_node + ")-[old_rel:" + edge_type + "]->(" + node + label_string + ") "\
				" FOREACH (ignore IN (CASE WHEN old_rel IS NULL THEN [] ELSE [1] END) |"\
					" MERGE (" + destination_node + ")-[new_rel:" + edge_type + "]->( " + node + " ) "
		elsif direction == Constant::LabelRelationships::IncomingRel
			clause = " "\
				" OPTIONAL MATCH (" + source_node + ")<-[old_rel:" + edge_type + "]-(" + node + label_string + ") "\
				" FOREACH (ignore IN (CASE WHEN old_rel IS NULL THEN [] ELSE [1] END) | "\
					" MERGE (" + destination_node + ")<-[new_rel:" + edge_type + "]-( " + node + " ) "
		else
			puts " Direction of relationship : #{edge_type} not mentioned !!".red
			clause = ""
		end
		if property_string.present?
			clause += " ON CREATE SET " + property_string + " "
		end
		clause += ") "
		clause
	end

end