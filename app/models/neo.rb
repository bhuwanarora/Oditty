class Neo

	def initialize
		@neo = Neography::Rest.new
	end

	def self.order_init 
		" ORDER BY "
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
		", " + clause   
	end

	def self.tail node_variable
		"  COLLECT (" + node_variable + ") AS temp UNWIND(TAIL(temp)) AS " + node_variable + " "
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
		" MERGE (day:Day{day:" + time.to_date.day.to_s + "}) MERGE (month:Month{month:" + time.to_date.month.to_s + "}) MERGE (year:Year{year:" + time.to_date.year.to_s + "})  MERGE (" + node_variable + ")-[:TimeStamp]->(day)<-[:Has_day]-(month)<-[:Has_month]-(year) "
	end
end