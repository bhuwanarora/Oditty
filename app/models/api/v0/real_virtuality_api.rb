module Api
	module V0
		class RealVirtualityApi
			def self.get_news id
				Book.new(id).get_news
			end

			def self.get_news_community id,community_id,skip_count
				Book.new(id).get_news_community community_id, skip_count
			end
		end
	end
end 