class User::Suggest::FriendSuggestion < User::Suggest
	
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def get_friends_of_friend
		@user.match + " MATCH (friend:User) "\
		" WHERE (user)-[:FollowsUser]->(:FollowsNode)-[:FollowedBy]->(friend) "\
		" OR (friend)-[:FollowsUser]->(:FollowsNode)-[:FollowedBy]->(user) "\
		" WITH user AS init_user, friend AS user "\
		" MATCH (friend:User) "\
		" WHERE ((user)-[:FollowsUser]->(:FollowsNode)-[:FollowedBy]->(friend) "\
		" OR (friend)-[:FollowsUser]->(:FollowsNode)-[:FollowedBy]->(user)) "\
		" AND (NOT (init_user)-->(:FollowsNode)-->(friend) AND init_user <> friend)"\
		" WITH DISTINCT(friend) AS user"\
		" RETURN " + User.basic_info + User::Suggest::FriendSuggestion.limit(10)
	end

end

