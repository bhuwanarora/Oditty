class Status::Feeling < Status
	def initialize feeling, user_id
		@user_id = user_id
		@feeling = feeling
	end
	def create 
		" MERGE (status)-[feels:Felt{ user_id: " + @user_id.to_s + "}]->(emotion:Emotion{name:\"" + @feeling + "\"}) "
	end
end