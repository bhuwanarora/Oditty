class Neo

	def initialize
		@neo = Neography::Rest.new
	end

	def self.order_init 
		" ORDER BY "
	end

	def self.get_labels id
		" MATCH (node) WHERE ID(node) = " + id.to_s + " RETURN labels(node) AS label "
	end

	def self.return_init
		" RETURN "
	end

	def self.skip skip_count
		" SKIP " + skip_count.to_s + " "
	end

	def self.collect_map map
		clause = ""
		map.each do |key, value|
			clause += " COLLECT ({" + value + "}) AS " + key + " "
		end
		clause   
	end

	def self.tail node_variable
		" COLLECT (" + node_variable + ") AS temp UNWIND(TAIL(temp)) AS " + node_variable + " "
	end

	def self.return_group(*params)
		" RETURN " + params.join(", ")
	end

	def self.merge_group(*params)
		" MERGE " + params.join(", ") + " "
	end

	def self.match_group(*params)
		" MATCH " + params.join(", ")
	end

	def self.limit limit_count
		" LIMIT " + limit_count.to_s + " "
	end

	def self.with_group(*params)
		" WITH " + params.join(", ") + " "
	end

	def self.execute clause
		@neo ||= self.initialize
		@neo.execute_query clause
	end

	def self.extract_unwind node_variable, path_name = "path"
		" EXTRACT (node IN nodes(" + path_name + ")|node) AS nodes UNWIND nodes AS " + node_variable + "  WITH " + node_variable + " "
	end


	def self.extract node_variable, path_name = "path"
		" EXTRACT (node IN nodes(" + path_name + ")|node) AS " + node_variable + " "
	end


	def self.unwind collection
		" UNWIND " + collection + " AS " + collection.singularize + " "
	end

	def self.delete node_variable
		" MATCH (" + node_variable + ")-[relation]-() DELETE relation, " + node_variable + " "
	end

	def self.create_timestamp time, node_variable
		"  MATCH (year:Year{year:#{time.to_date.year}})-[:Has_month]->(month:Month{month:#{time.to_date.month}})-[:Has_day]->(day:Day{day:#{time.to_date.day}}) MERGE (" + node_variable + ")-[:TimeStamp]->(day) WITH " + node_variable + " "
	end

	def self.where_group(*params)
		" WHERE " + params.join(" AND ") + " "
	end

	def self.order_by property
		Neo.order_init + property + " "
	end

	def self.replace_string replacement_hash, neo4j_string
		output_neo4j_string = "LOWER (" + neo4j_string + ")"
		replacement_hash.each do |to_replace, replace_with|
			if to_replace == "'"
				output_neo4j_string = " REPLACE (" + output_neo4j_string + ", \"\\'\", \'" + replace_with + "\') "
			else
				output_neo4j_string = " REPLACE (" + output_neo4j_string + ", \'" + to_replace + "\', \'" + replace_with + "\') "
			end
		end
		output_neo4j_string
	end

	def self.delete_element_optional_match collection_name
		" FOREACH (elem IN (CASE WHEN " + collection_name + " IS NULL THEN [] ELSE [" + collection_name + "] END) |
			DELETE elem "\
			")"
	end
end