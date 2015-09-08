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
				params_user = {:skip => skip}
				info = RedisHelper::Game.get_users(params_user)
				render :json => info, :status => 200
			end

			def get_score
				user_id = session[:user_id]
				info = Api::V0::GamesApi.get_score(user_id).execute[0]
				info[0]["rank"] = RedisHelper::Game.get_user_rank({:id => user_id})
				render :json => info, :status => 200
			end

			def save_score
				user_id = session[:user_id]
				score = params[:score]
				info = Api::V0::GamesApi.save_score(user_id, score)
				params_user = 
				{
					:score => score,
					:user_id => user_id
				}
				RedisHelper::Game.set_user_rank params_user
				render :json => {:message => "Success"}, :status => 200
			end
		end
	end
end