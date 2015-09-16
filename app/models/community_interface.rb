class CommunityInterface < Neo
	
	def self.get_popular_communities
		Community.get_popular
	end
	
	def self.get_combined_details id
		community_clause = Community.new(id).get_combined_details
		facebook_clause = FacebookLike.new(nil, id).get_combined_details
		clause = community_clause + " UNION ALL " + facebook_clause
		clause.execute
	end

	def self.suggest_communities user_id
		clause = User::Suggest::CommunitySuggestion.get_trending_communities
	end

	def self.add_book id, book_id, user_id
		@community = Community.new(id)
		clause = @community.match + @community.add_book(book_id, user_id)
		clause.execute
	end

	def self.top_communities user_id, skip_count
		if user_id
			clause  = UsersCommunity.top_communities  user_id, skip_count
		else
			clause = Community.top_communities skip_count
		end
		clause
	end

	def self.get_detailed_info(id, user_id)
		if user_id.present?
			community_clause = UsersCommunity.new(user_id, id).get_info
			facebook_clause = FacebookLike.new(nil, id).get_info(user_id)
			clause = community_clause + " UNION " + facebook_clause
			output = clause.execute[0]
		else
			output = Api::V0::CommunityApi.get_news(id, 0)[0]
		end
		output
	end

	def self.get_books id
		community_clause = Community.new(id).get_books
		facebook_clause = FacebookLike.new(nil, id).get_books
		clause = community_clause + " UNION " + facebook_clause
		clause
	end

	def self.get_news(id, skip_count)
		community_clause = Community.new(id).get_news(skip_count)
		facebook_clause = FacebookLike.new(nil, id).get_news(skip_count)
		clause = community_clause + " UNION " + facebook_clause
		output = clause.execute
		output
	end

	def self.get_videos(id)
		community_clause = Community.new(id).get_videos
		facebook_clause = FacebookLike.new(nil, id).get_videos
		clause = community_clause + " UNION " + facebook_clause
		output = clause.execute
		output
	end

	def self.get_rooms user_id, skip_count
		clause = ""
		if user_id.present?
			clause = User.new(user_id).popular_rooms skip_count
		else
			clause = Community.get_most_viewed_rooms skip_count
		end
		clause.execute
	end

end