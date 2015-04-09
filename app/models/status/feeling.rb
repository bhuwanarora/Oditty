class Status::Feeling < Status
	def initialize emotion, user_id
		@user_id = user_id
		@emotion = emotion
	end
	
	def create 
		" MERGE(emotion:Emotion{name:\"" + @emotion.to_s + "\" }) CREATE UNIQUE (status)-[feeling:Feeling{ user_id: " + @user_id.to_s + "}]->(emotion) WITH status "
	end

	def self.create_group(emotions, user_id)
		clause = ""
		unless emotions.nil?
			for emotion in emotions do 
				clause = clause + Status::Feeling.new(emotion, user_id).create
			end
		end
		clause
	end

end