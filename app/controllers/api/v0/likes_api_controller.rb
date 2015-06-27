module Api
	module V0
		class LikesApiController < ApplicationController
			def fb_likes
				user_id = session[:user_id]
				if user_id
					Api::V0::LikeApi.add_facebook_likes(params, user_id)
					render :json => {:message => "Success"}, :status => 200
				else
					render :json => {:message => "Session not been set"}, :status => 200
				end
			end

			def self.set_info
				like_app_id = params[:id]
				Api::V0::LikeApi.map_books_for_likes(like_app_id)
				render :json => {:message => "Success"}, :status => 200
			end

			def self.get_likes
				user_id = session[:user_id]
				info = Api::V0::LikeApi.get_likes user_id
				render :json => info, :status => 200
			end
		end
	end
end