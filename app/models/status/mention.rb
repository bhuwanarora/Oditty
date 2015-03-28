class Status::Mention < Status
	def initialize user_id
		@user = User.new(user_id)
	end
	def create user_id, node_variable
		" MERGE (status)-[:Mentions{user_id: " + user_id.to_s + "}]->(" + node_variable + ") WITH status " 
	end
end