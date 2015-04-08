module Api
	module V0
		class FeedsApi

			def self.get_feed(user_id, params)
				Api::V0::NewsApi.get_feed(user_id, params)
			end

		end
	end
end

# session[:blog_feed_id] 	= BLOG_ID
# session[:listopia_id] 	= LISTOPIA_ID
# session[:social_feed_id] 	= SOCIAL_FEED_ID
# session[:trending_id] 	= TRENDING_ID

# session[:personal_id] 	= PERSONAL_ID
