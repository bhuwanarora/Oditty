class Status::Feeling < Status
	def initialize feeling, user_id
		@user_id = user_id
		@feeling = feeling
	end
	def create 
		" MERGE (status)-[feels:Felt{ user_id: " + @user_id.to_s + "}]->(emotion:Emotion{name:\"" + @feeling + "\"}) "
	end

	def self.create_group feelings, user_id
		clause = ""
		unless feelings.nil?
			feelings.each{|feeling| clause +=  " WITH status " + Status::Feeling.new(feeling, user_id).create}
		end
		clause
	end
end