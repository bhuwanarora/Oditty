module Api	
	module V0
		class RoomApiController < ApplicationController
			def get_books
				user_id = session[:user_id]
				info = User.new(user_id).get_books_from_public_shelves
				render :json => info, :status => 200
			end

			def get_articles
				user_id = session[:user_id]
				info = User.new(user_id).get_articles_from_public_shelves.execute
				render :json => info, :status => 200
			end

			def get_visited_books
				user_id = session[:user_id]
				info = User.new(user_id).get_visited_books
				render :json => info, :status => 200
			end

			def get_visited_articles
				user_id = session[:user_id]
				info = User.new(user_id).get_visited_articles.execute
				render :json => info, :status => 200
			end
		end
	end
end