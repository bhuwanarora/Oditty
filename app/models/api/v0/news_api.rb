module Api
	module V0
		class NewsApi

			def self.get_feed(user_id, params)
				
			end

			def self.add_news(params)
				NewsHelper.add_news params
			end

		end
	end
end