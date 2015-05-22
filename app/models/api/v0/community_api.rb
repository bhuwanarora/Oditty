module Api
	module V0
		class CommunityApi

			def self.get_detailed_info(id, user_id)
				if user_id
					# Community.new(id).get_info
				else
				end
				UsersCommunity.new(user_id, id).get_info
			end

			def self.create_visited_news user_id, news_id
				News.new(news_id).create_visited(user_id)
			end

			def self.suggest_communities user_id, skip_count
				info = Community.suggest_communities(user_id, skip_count)
			end
		end
	end
end