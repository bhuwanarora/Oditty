class UsersUser < Neo

	def initialize(user_id, friend_id)
		@user_id = user_id
		@friend_id = friend_id
	end

	def self.follow
		match_clause = "MATCH (u:User), (f:User) WHERE ID(u)="+@user_id.to_s+" AND ID(f)="+@friend_id.to_s+" "

		ego_clause = " MATCH (u)-[old:Ego{user_id:ID(u)}]->(old_ego) CREATE (u)-[:Ego{user_id:ID(u)}]->(f)-[:Ego{user_id:ID(u)}]->(old_ego) DELETE old WITH u, f "

		follow_clause = "CREATE UNIQUE (u)-[r:Follow]->(f) SET r.timestamp = "+Time.now.to_i.to_s

		clause = match_clause + ego_clause + follow_clause
		clause
	end

	def self.unfollow
		match_clause = "MATCH (u:User), (f:User) WHERE ID(u)="+@user_id.to_s+" AND ID(f)="+@friend_id.to_s+" "

		existing_ego_clause = "MATCH (x1)-[r1:Ego{user_id:ID(u)}]->(f)-[r2:Ego{user_id:ID(u)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(u)}]->(x2) DELETE s, t)) WITH u, f "

		unfollow_clause = "MATCH (u)-[r:Follow]->(f) DELETE r "

		clause = match_clause + existing_ego_clause + unfollow_clause
		clause
	end

end