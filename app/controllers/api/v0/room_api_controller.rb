module Api	
	module V0
		class RoomApiController < ApplicationController
			def get_books
				user_id = session[:user_id]
				info = Api::V0::RoomApi.get_books_from_public_shelves(user_id)
				render :json => info, :status => 200
			end

			def get_articles
				user_id = session[:user_id]
				info = Api::V0::RoomApi.get_articles_from_public_shelves(user_id)
				render :json => info, :status => 200
			end

			def get_visited_books
				user_id = session[:user_id]
				info = Api::V0::RoomApi.get_visited_books(user_id)
				render :json => info, :status => 200
			end

			def get_visited_articles
				user_id = session[:user_id]
				info = Api::V0::RoomApi.get_visited_articles(user_id)
				render :json => info, :status => 200
			end

			def get_labels
				id = params[:id]
				info = Api::V0::RoomApi.get_labels(id).execute
				render :json => info, :status => 200
			end
		end
	end
end