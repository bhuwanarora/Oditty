module Api
	module V0
		class RealVirtualityApi
			def self.get_news id
				Book.new(id).get_news
			end

			def self.get_community_news community_id, skip_count
				Community.new(community_id).get_news skip_count
			end
		end
	end
end 