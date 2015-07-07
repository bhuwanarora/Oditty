class User::Suggest::FriendSuggestion < User::Suggest
	
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def get_friends_of_friend
		@user.match + UsersUser.match_all + User::Suggest::FriendSuggestion.where_group("friend <> user") + User::Suggest::FriendSuggestion.with_group("friend AS user", "user AS init_user") + UsersUser.match_all + ", init_user " + User::Suggest::FriendSuggestion.where_group("friend <> init_user") + User::Suggest::FriendSuggestion.with_group("DISTINCT(friend) AS user") + User::Suggest::FriendSuggestion.return_group(User.basic_info) + User::Suggest::FriendSuggestion.limit(10)
	end

end