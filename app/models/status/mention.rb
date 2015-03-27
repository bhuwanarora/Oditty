class Status::Mention < Status
	def self.create user_id, mentioned_id
		" MATCH (mentioned) WHERE ID(mentioned) = " + mentioned_id.to_s + " MERGE (status)-[:Mentions{user_id: " + user_id.to_s + "}]->(mentioned) WITH status " 
	end
end