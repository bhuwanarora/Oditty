module Api
	module V0
		class RealVirtualityApi
			def self.get_news id
				Book.new(id).get_news
			end

			def self.get_news_community community_id,skip_count
				User::Suggest::CommunitySuggestion.get_news community_id, skip_count
			end
		end
	end
end 