class User::Suggest::CommunitySuggestion < User::Suggest
	
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def get_communities
		clause = ""
		if(@user_id.present?)
			clause = Community.match + Community.order_by("community.follow_count DESC") + @user.match + ", community " + " OPTIONAL " + UsersCommunity.match + " WITH community, user, (CASE WHEN follow_node IS NULL THEN 0 ELSE 1 END) AS follow_status "\
				"WHERE follow_status = 0 " + Community.return_group(Community.basic_info) + ", follow_status " + Community.order_by("follow_count DESC") + Community.limit(12)
		else
			clause = Community.match + "WITH community " + Community.order_by("community.follow_count DESC") + Community.limit(12) +  Community.return_group(Community.basic_info) + ", 0 AS follow_status " + Community.order_by("follow_count DESC")
		end
		clause
	end

	def self.get_trending_communities
		News.match_popular_news_from_last_week + News.match_community + User::Suggest::CommunitySuggestion.where_group("community.view_count IS NOT NULL") + User::Suggest::CommunitySuggestion.with_group("DISTINCT community As community") + User::Suggest::CommunitySuggestion.return_group(Community.basic_info) + User::Suggest::CommunitySuggestion.order_by("community.view_count DESC") + User::Suggest::CommunitySuggestion.limit(10)
	end

end