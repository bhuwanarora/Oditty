
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

	def self.follow_match
		" MATCH (user)-[follows_user:FollowsUser]->(follows_node:FollowsNode)-[followed_by:FollowedBy]->(friend) "
	end

	def match 
		UsersUser.follow_match + " WHERE ID(user) = " + @user_id.to_s + " AND ID(friend) = " + @friend_id.to_s + " WITH user, follows_user, friend, follows_node, followed_by "
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
	
	def match_book book_id
		clause = " MATCH (user:User), (book:Book), (friend:User) "
		clause += "WHERE ID(user)="+@user_id.to_s+" AND ID(book)="+book_id.to_s+" AND ID(friend)="+@friend_id.to_s+" "
		clause
	end

	def create_recommendation book_id
		" CREATE UNIQUE (user)-[:RecommendedTo]->(friend)-[:RecommendedAction]->( "\
		"recommend_node:RecommendNode{book_id:" + book_id.to_s + ", user_id:" + @user_id.to_s + ", "\
		"friend_id:" + @friend_id.to_s + ", timestamp:\'" + Time.now.getutc.to_i.to_s + "\'})-[:Recommended]->(book) "
	end

	def recommend_book book_id
		clause = match_book book_id
		clause += create_recommendation book_id
		clause += " WITH user, friend, book, recommend_node "
		clause += User::Feed.new(@user_id).create("recommend_node") + ", friend, book "
		clause += Book::BookFeed.new(book_id).create("recommend_node") + ", friend "
		clause += User.set_total_count(Constant::Count::TotalCountIncrementRecommendation,"+")
		clause += Book.set_recommended_count(1, "+")
		clause += " WITH friend as user, recommend_node "
		clause += User::UserNotification.add("recommend_node")
		clause += " RETURN ID(recommend_node)"
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
		@user.match + User::Info.set_follows_count(operation) + " WITH user " + @friend.match("friend") + ", user " + create +  User::Feed.new(@user_id).create("follows_node")  + ", friend WITH follows_node, friend AS user " + User::UserNotification.add(@notification_node_variable) + User::Info.set_followed_by_count(operation) + UsersUser.return_init + User.basic_info
	end

	def remove
		User::Feed.new(@user_id).delete_feed("follows_node") + ", friend" + User::Feed.new(@friend_id).delete_feed("follows_node") + ", friend "  + User::UserNotification.remove("follows_node") + ", friend AS user " + UsersUser.delete("follows_node") + " WITH DISTINCT user " 
	end

	def unfollow
		operation = "-"
		match + User::Info.set_follows_count(operation) + " WITH user, follows_node, friend " + remove  + User::Info.set_followed_by_count(operation) + " WITH user AS ignore_it " + " OPTIONAL " + match + " DELETE follows_node, followed_by, follows_user WITH friend AS user " + UsersUser.return_group(User.basic_info)
	end

	def self.add_notification node_variable
		" WITH user AS friend " + " , " + node_variable + UsersUser.match  + " , " + node_variable + User::UserNotification.add(node_variable)
	end

	def get_basic_info
		@user.match + optional_match_invert + UsersUser.return_group(User.basic_info, "ID(follows_node) as status")
	end

	def optional_match_invert
		" OPTIONAL MATCH (friend)-[follows_user:FollowsUser]->(follows_node:FollowsNode)-[followed_by:FollowedBy]->(user) WHERE ID(friend) = " + @friend_id.to_s + " AND ID(user) = "+ @user_id.to_s + " WITH user, friend, follows_node "
	end

end