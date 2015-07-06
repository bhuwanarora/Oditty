module Api
	module V0
		class LikesApiController < ApplicationController
			def fb_likes
				#user_id = session[:user_id]
				user_id = 3565843
				if user_id
					Api::V0::LikeApi.add_facebook_likes({"data" =>params["_json"]}, user_id)
					render :json => {:message => "Success"}, :status => 200
				else
					render :json => {:message => "Session not been set"}, :status => 200
				end
			end

			def set_info
				data = params["_json"][0]
				Api::V0::LikeApi.set_info(data)
				render :json => {:message => "Success"}, :status => 200
			end

			def get_likes
				#user_id = session[:user_id]
				user_id = 3565843
				info = Api::V0::LikeApi.get_likes user_id
				render :json => info, :status => 200
			end
		end
	end
end