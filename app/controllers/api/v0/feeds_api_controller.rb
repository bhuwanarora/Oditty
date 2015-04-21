module Api
	module V0
		class FeedsApiController < ApplicationController

			def get_feed
				user_id = session[:user_id]
				info = Api::V0::FeedsApi.get_feed(user_id, params)
				render :json => info, :status => 200
			end

			def get_blog
				skip_count = params[:skip_count]
				info = Api::V0::FeedsApi.get_blog(skip_count).execute
			end

			def get_news
				skip_count = params[:skip_count]
				info = Api::V0::FeedsApi.get_news(skip_count).execute
			end
		end
	end
end