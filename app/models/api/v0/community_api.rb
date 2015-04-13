module Api
	module V0
		class CommunityApi

			def self.get_news(id)
				Community.new(id).get_news
			end
		end
	end
end