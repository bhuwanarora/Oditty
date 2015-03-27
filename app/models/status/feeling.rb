class Status::Feeling < Status
	def self.create user_id, feeling
		" (status)-[:Feeling{ user_id: " + user_id.to_s + "}]->(feeling:Feel{name:\"" + feeling + "\"}) "
	end
end