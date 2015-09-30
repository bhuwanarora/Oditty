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
				info = []
				news_day_skip_count = 0
				if user_id
					news_skip_count = RedisHelper::Session.get_session({:id => session[:session_id]})["news_skip_count"] rescue nil
					news_skip_count ||= params[:skip].to_i
					info = Api::V0::FeedsApi.get_personalized_news(user_id, news_skip_count)
					community_follow_count = info[0]["community_follow_count"] rescue 0
					info = info[0]["news"] rescue []
				end
				if !user_id || community_follow_count == 0
					region = params[:id]
					redis_session = RedisHelper::Session.get_session({:id => session[:session_id]})
					news_skip_count = redis_session["news_skip_count"] rescue nil
					news_skip_count ||= params[:skip].to_i
					news_day_skip_count = redis_session["news_day_skip_count"] rescue 0
					info = Api::V0::FeedsApi.get_news(news_skip_count, news_day_skip_count, region).execute
					if info.blank?
						news_day_skip_count += 1
						news_skip_count = 0
						info = Api::V0::FeedsApi.get_news(news_skip_count, news_day_skip_count, region).execute
					end
				end
				news_skip_count += info.length
				redis_param =
				{
					:id 	=> session[:session_id],
					:info 	=>
					{
						:news_skip_count => news_skip_count,
						:news_day_skip_count => news_day_skip_count
					}
				}
				RedisHelper::Session.set_session(redis_param)
				render :json => info, :status => 200
			end

			def last_blog
				info = Api::V0::FeedsApi.last_blog.execute
				render :json => info, :status => 200
			end

		end
	end
end