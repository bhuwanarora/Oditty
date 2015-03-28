class Status::Mention < Status
	def initialize
		
	end
	def create user_id, node_variable
		" MERGE (status)-[:Mentions{user_id: " + user_id.to_s + "}]->(" + node_variable + ") WITH status " 
	end
end