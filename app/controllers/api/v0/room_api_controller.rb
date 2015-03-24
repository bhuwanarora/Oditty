module Api	
	module V0
		class RoomApiController < ApplicationController
			def get_books
				user_id = session[:user_id]
				info = User.new(user_id).get_books_from_public_shelves.execute
				render :json => info, :status => 200
			end

			def get_blogs
				user_id = session[:user_id]
				info = User.new(user_id).get_blogs_from_public_shelves.execute
				render :json => info, :status => 200
			end

			def get_news
				user_id = session[:user_id]
				info = User.new(user_id).get_news_from_public_shelves.execute
				render :json => info, :status => 200
			end

			def get_visited_books
				user_id = session[:user_id]
				info = User.new(user_id).get_visited_books.execute
				render :json => info, :status => 200
			end

			def get_visited_news
				user_id = session[:user_id]
				info = User.new(user_id).get_visited_news.execute
				render :json => info, :status => 200
			end

			def get_visited_blogs
				user_id = session[:user_id]
				info = User.new(user_id).get_visited_blogs.execute
				render :json => info, :status => 200
			end
		end
	end
end