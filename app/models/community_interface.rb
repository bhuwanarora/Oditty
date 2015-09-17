class CommunityInterface < Neo
	
	def self.get_popular_communities
		Community.get_popular
	end
	
	def self.get_combined_details id
		community_clause = Community.new(id).get_combined_details
		facebook_clause = FacebookLike.new(id).get_combined_details
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
		if user_id.nil?
			community_clause = UsersCommunity.new(user_id, id).get_info
			facebook_clause = FacebookLike.new(id).get_info(user_id)
			clause = community_clause + " UNION " + facebook_clause
			output = clause.execute[0]
		else
			output = Api::V0::CommunityApi.get_news(id, 0)[0]
		end
		output
	end

	def self.get_books id
		community_clause = Community.new(id).get_books
		facebook_clause = FacebookLike.new(id).get_books
		clause = community_clause + " UNION " + facebook_clause
		clause
	end

	def self.get_news(id, skip_count, time)
		community_clause = Community.new(id).get_news(skip_count, time)
		facebook_clause = FacebookLike.new(id).get_news(skip_count, time)
		clause = community_clause + " UNION " + facebook_clause
		output = clause.execute
		output
	end


	def self.get_videos(id)
		community_clause = Community.new(id).get_videos
		facebook_clause = FacebookLike.new(id).get_videos
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

	# common functions
	def get_news skip_count, time_string
		if time_string.present?
			get_old_news skip_count, time_string
		else
			get_recent_news skip_count
		end
	end

	def self.get_communities_from_fb_likes user_id, skip_count
		fb_id = (User.new(user_id).match + User::FacebookUser.match + User::FacebookUser.return_group(User::FacebookUser.id_info)).execute[0]["fb_id"] rescue nil
		if fb_id.nil?
			output = []
		else
			output = User::FacebookUser.new({"id" => fb_id}).get_recommended_communities(skip_count).execute
		end
		output
	end

	def self.match_news_in_period time_string, with_elems = []
		with_string = with_elems.map{|elem| (elem)}.join(", ")
		with_string = ", " + with_string if with_string.present?
		(year, month) = time_string.split("/")

		Community.match_news + with_string + " WHERE "\
		" (news)-[:TimeStamp]->(:TimePeriod)-[:FromDay]->(:Day)<-[:Has_day]-(:Month{month:" + month + "})<-[:Has_month]-(:Year{year:" + year + "}) "\
		" WITH community, news "
	end
end