class User::Suggest::CommunitySuggestion < User::Suggest
	
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def get_communities
		clause = ""
		if(@user_id.present?)
			clause = Community.match + Community.order_by("community.follow_count DESC") + @user.match + ", community " + " OPTIONAL " + UsersCommunity.match + " WITH community, user, (CASE WHEN follow_node IS NULL THEN 0 ELSE 1 END) AS follow_status "\
				"WHERE follow_status = 0 " + Community.return_group(Community.basic_info) + ", follow_status " + Community.order_by("follow_count DESC") + Community.limit(10)
		else
			clause = Community.match + "WITH community " + Community.order_by("community.follow_count DESC") + Community.limit(10) +  Community.return_group(Community.basic_info) + ", 0 AS follow_status " + Community.order_by("follow_count DESC")
		end
		clause
	end

end