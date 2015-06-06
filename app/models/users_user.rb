
class UsersUser < Neo

	def initialize(user_id, friend_id)
		@user_id = user_id
		@user = User.new(user_id)
		@friend_id = friend_id
		@friend = User.new(friend_id)
		@notification_node_variable = "follows_node"
	end

	def create
		" MERGE (user)-[follows_user:FollowsUser]->(follows_node:FollowsNode{friend_id:ID(friend), user_id: ID(user)}) MERGE (follows_node)-[followed_by:FollowedBy]->(friend) SET follows_node.created_at = " + Time.now.to_i.to_s + ", follows_node.updated_at = " + Time.now.to_i.to_s + " WITH user, follows_user, friend, follows_node, followed_by "
	end

	def match 
		" MATCH (user)-[follows_user:FollowsUser]->(follows_node:FollowsNode)-[followed_by:FollowedBy]->(friend) WHERE ID(user) = " + @user_id.to_s + " AND ID(friend) = " + @friend_id.to_s + " WITH user, follows_user, friend, follows_node, followed_by "
	end

	def self.reverse_match 
		" MATCH (friend)-[follows_user:FollowsUser]->(follows_node:FollowsNode)-[followed_by:FollowedBy]->(user) WITH user, friend "
	end

	def optional_match
		" OPTIONAL " + match
	end

	def self.optional_reverse_match
		" OPTIONAL " + reverse_match
	end

	def recommend(book_id)
		#increase in book, reccomend count.
		#Feeds: who has reccomended,
		#user -> reccomendNode  -> book ->user
		"MATCH (u:User), (b:Book), (friend:User) 
		WHERE ID(u)="+@user_id.to_s+" AND ID(b)="+book_id.to_s+" AND ID(friend)="+@friend_id.to_s+" "\
		"CREATE UNIQUE (u)-[:RecommendedTo]->(friend)-[:RecommendedAction]->( "\
			"rn:RecommendNode{book_id:" + book_id.to_s + ",user_id:" + @user_id.to_s + ", "\
			"friend_id:"+@friend_id.to_s+", timestamp:"+Time.now.getutc.to_s+"})-[:Recommended]->(b) "\
		"WITH u, friend, b, rn "\
		""\
		"MATCH (u)-[old:FeedNext]->(old_feed) "\
		"CREATE UNIQUE (u)-[:FeedNext{user_id:" + @user_id.to_s"}]->(rn)-[:FeedNext{user_id:" + @user_id.to_s"}]->(old_feed) "\
		"DELETE old "\
		"WITH u, friend, b, rn "\
		""\
		"MATCH (b)-[old:BookFeed]->(old_feed) "\ 
		"CREATE UNIQUE (b)-[:BookFeed{user_id:" + @user_id.to_s + "}]->(rn)-[:BookFeed{user_id:" + @user_id.to_s + "}]->(old_feed) "\
		"DELETE old "\
		"WITH u, friend, b, rn "\
		""\
		"OPTIONAL MATCH (u)<-[:Follow]-(f:User) "\
		"OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) "\
		"FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | "\
			"FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | "\
				"CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) "\
				"DELETE s, t)) "\
		"WITH u, friend, b, f "
		""\
		"OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) "\
		"FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | "\
			"FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | "\
				"CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) "\
				"DELETE old)) "\
		"WITH DISTINCT u, friend, b "\
		""\
		"SET u.total_count = CASE WHEN u.total_count IS NULL THEN 1 ELSE u.total_count + 10 END, "\
		"b.recommended_count = CASE WHEN b.recommended_count IS NULL THEN 1 ELSE b.recommended_count + 1 END"
	end

	def self.match_all
		" MATCH (user)-[follows_user:FollowsUser]-(follows_node:FollowsNode)-[followed_by:FollowedBy]-(friend) WITH user, friend "
	end

	def self.match
		" MATCH (user)-[follows_user:FollowsUser]->(follows_node:FollowsNode)-[followed_by:FollowedBy]->(friend) WITH user, friend "
	end

	def self.match_followers
		" MATCH (friend)<-[followed_by:FollowedBy]-(follows_node:FollowsNode)<-[follows_user:FollowsUser]-(user) WITH user, friend "
	end

	def follow
		operation = "+"
		@user.match + User::Info.set_follows_count(operation) + " WITH user " + @friend.match("friend") + ", user " + create +  User::Feed.new(@user_id).create("follows_node")  + ", friend WITH follows_node, friend AS user " + User::Feed.new(@friend_id).create("follows_node") + User::UserNotification.add(@notification_node_variable) + User::Info.set_followed_by_count(operation) + UsersUser.return_init + User.basic_info
	end

	def remove
		User::Feed.new(@user_id).delete_feed("follows_node") + ", friend" + User::Feed.new(@friend_id).delete_feed("follows_node") + ", friend "  + User::UserNotification.remove("follows_node") + ", friend AS user " + UsersUser.delete("follows_node") + " WITH DISTINCT user " 
	end

	def unfollow
		operation = "-"
		match + User::Info.set_follows_count(operation) + " WITH user, follows_node, friend " + remove  + User::Info.set_followed_by_count(operation) + UsersUser.return_group(User.basic_info) 
	end

	def self.add_notification node_variable
		" WITH user AS friend " + " , " + node_variable + UsersUser.match  + " , " + node_variable + User::UserNotification.add(node_variable)
	end

	def get_basic_info
		@user.match + optional_match + UsersUser.return_group(User.basic_info, "ID(follows_node) as status")
	end

	def self.optional_match_invert
		" OPTIONAL MATCH (friend)-[follows_user:FollowsUser]->(follows_node:FollowsNode)-[followed_by:FollowedBy]->(user) WITH user, friend, follows_node "
	end
end