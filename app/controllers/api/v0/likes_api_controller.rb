module Api
	module V0
		class LikesApiController < ApplicationController
			def fb_likes
				render :json => {:message => "Success"}, :status => 200
			end

			def set_info
				render :json => {:message => "Success"}, :status => 200
			end

			def get_likes
				user_id = session[:user_id]
				info = Api::V0::LikeApi.get_likes user_id
				render :json => info, :status => 200
			end
		end
	end
end