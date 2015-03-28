class Status::Feeling < Status
	def initialize feeling, user_id
		@user_id = user_id
		@feeling = feeling
	end
	def create 
		" (status)-[:Feeling{ user_id: " + @user_id.to_s + "}]->(feeling:Feel{name:\"" + @feeling + "\"}) "
	end
end