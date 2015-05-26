module Api
	module V0
		class CommunityApi

			def self.get_popular_communities
				Community.get_popular
			end

			def self.get_detailed_info(id, user_id)
				UsersCommunity.new(user_id, id).get_info
			end

			def self.create_visited_news user_id, news_id
				News.new(news_id).create_visited(user_id)
			end

			def self.suggest_communities user_id, skip_count
				info = Community.suggest_communities(user_id, skip_count)
			end

			def self.top_communities user_id, skip_count
				if user_id
					clause  = UsersCommunity.top_communities  user_id, skip_count
				else
					clause = Community.top_communities skip_count
				end
				clause
			end
		end
	end
end