module Api
	module V0
		class GamesApiController < ApplicationController

			def get_books
				user_id = session[:user_id]
				info = Api::V0::GamesApi.get_books(user_id)
				render :json => info, :status => 200
			end

			def get_users
				skip = params[:skip]
				user_id = session[:user_id]
				info = Api::V0::GamesApi.get_users(user_id)
				render :json => info, :status => 200
			end

			def get_score
				user_id = session[:user_id]
				info = Api::V0::GamesApi.get_score(user_id)
				render :json => info, :status => 200
			end

			def save_score
				user_id = session[:user_id]
				score = params[:score]
				info = Api::V0::GamesApi.save_score(user_id, score)
				render :json => {:message => "Success"}, :status => 200
			end
		end
	end
end