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
				render :json => info, :status => 200
			end

			def get_news  
				if params["new_landing"] == "true"
					session[:news_day_skip_count] = 0
					session[:news_skip_count] = 0
				end 
				session[:news_skip_count] += Constant::Count::SkipNews
				if (info = Api::V0::FeedsApi.get_news(session[:news_skip_count], session[:news_day_skip_count]).execute).blank?
					session[:news_day_skip_count] += Constant::Count::SkipDays
					session[:news_skip_count] = 0
					info = Api::V0::FeedsApi.get_news(session[:news_skip_count], session[:news_day_skip_count]).execute
				end
				render :json => info, :status => 200
			end

			def last_blog
				info = Api::V0::FeedsApi.last_blog.execute
				render :json => info, :status => 200
			end
		end
	end
end