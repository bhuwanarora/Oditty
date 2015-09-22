module Api
	module V0
		class FeedsApiController < ApplicationController

			def get_feed
				user_id = session[:user_id]
				info = Api::V0::FeedsApi.get_feed(user_id, params)
				render :json => info, :status => 200
			end

			def get_blog
				skip_count = params[:skip_count] || 1
				multiple = params[:multiple] || false
				info = Api::V0::FeedsApi.get_blog(skip_count, multiple).execute
				render :json => info, :status => 200
			end

			def get_news
				user_id = session[:user_id]
				skip_count = params[:skip].to_i
				info = Api::V0::FeedsApi.get_news(user_id, skip_count).execute
				render :json => info, :status => 200
			end

			def last_blog
				info = Api::V0::FeedsApi.last_blog.execute
				render :json => info, :status => 200
			end

		end
	end
end