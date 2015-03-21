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

	def self.match
		" OPTIONAL MATCH (user)<-[:Follow]-(friend:User) "
	end

	def self.remove_user_from_friends_ego_chain
		" OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(friend)}]->(user)-[r2:Ego{user_id:ID(friend)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(friend)}]->(x2) DELETE s, t)) WITH user, friend "
	end

	def self.friend_ego_chain
		"OPTIONAL MATCH (friend)-[old:Ego{user_id:ID(friend)}]->(old_ego) "
	end

	def self.add_user_to_friends_ego_chain
		UsersUser.friend_ego_chain + " FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN friend IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(user)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH DISTINCT user "
	end

end