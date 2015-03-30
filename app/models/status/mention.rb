class Status::Mention < Status
	def initialize user_id
		@user = User.new(user_id)
		@user_id = user_id
	end
	def create node_variable
		" MERGE (status)-[mentions:Mentions{user_id: " + @user_id.to_s + "}]->(" + node_variable + ") WITH status " 
	end
end