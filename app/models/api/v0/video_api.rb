module Api
	module V0
		class VideoApi
			def self.update_community_videos community_id, videos
				CommunitiesHelper.map_videos_by_id(community_id, videos)
			end
		end
	end
end