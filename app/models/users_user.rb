class UsersUser < Neo

	def initialize(user_id, friend_id)
		@user_id = user_id
		@user = User.new(user_id)
		@friend_id = friend_id
		@friend = User.new(friend_id)
	end

	def create
		" MERGE (user)-[follows_user:FollowsUser]->(follows_node:FollowsNode{created_at: " + Time.now.to_i.to_s + ", updated_at: " + Time.now.to_i.to_s + ", friend_id:ID(friend), user_id: ID(user)})-[followed_by:FollowedBy]->(friend)  WITH user, follows_user, friend, follows_node, followed_by "
	end

	def match 
		" MATCH (user)-[follows_user:FollowsUser]->(follows_node:FollowsNode)-[followed_by:FollowedBy]->(friend) WHERE ID(user) = " + @user_id.to_s + " AND ID(friend) = " + @friend_id.to_s + " WITH user, follows_user, friend, follows_node, followed_by "
	end

	def follow
		@user.match + @friend.match("friend") + ", user " + create +  User::Feed.new(@user_id).create("follows_node")  + ", friend WITH follows_node, friend AS user " + User::Feed.new(@friend_id).create("follows_node") + UsersUser.return_init + User.basic_info
	end

	def unfollow
		match + User::Feed.new(@user_id).delete_feed("follows_node") + ", friend" + User::Feed.new(@friend_id).delete_feed("follows_node") + ", friend" + UsersUser.delete("follows_node") 
	end
end