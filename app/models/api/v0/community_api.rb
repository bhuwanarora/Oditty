module Api
	module V0
		class CommunityApi
			def self.get_books community_id
				Community.new(community_id).get_books.execute
			end

			def self.get_users community_id
				Community.new(community_id).get_users.execute
			end

			def self.get_communities_chronologically community_id
				Community.new(community_id).get_communities_chronologically.execute
			end
		end
	end
end