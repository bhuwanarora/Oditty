module Api
	module V0
		class VideosApiController < ApplicationController
			def add
				Api::V0::VideoApi.update_community_videos(params[:community_id], params[:videos])
				render :json => true, :status => 200
			end
		end
	end
end