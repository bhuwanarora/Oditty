module Api
	module V0
		class CommunityApi

			def self.get_detailed_info(id, user_id)
				UsersCommunity.new(user_id, id).get_info
			end

			def self.create_visited_news user_id, news_id
				News.new(news_id).create_visited(user_id)
			end
		end
	end
end