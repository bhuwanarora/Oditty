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
				if user_id
					skip_count = RedisHelper::Session.get_session({:id => user_id})["news_skip_count"] rescue nil;
					skip_count ||= params[:skip].to_i;
					info = Api::V0::FeedsApi.get_personalized_news(user_id, skip_count)
					community_follow_count = info[0]["community_follow_count"] rescue 0
					info = info[0]["news"] rescue []
				end
				if !user_id || community_follow_count == 0
					region = params[:id]
					puts "0 #{session[:news_skip_count]} #{session[:news_day_skip_count]}".red
					session[:news_skip_count] ||= 0
					session[:news_day_skip_count] ||= 0
					puts "1 #{session[:news_skip_count]} #{session[:news_day_skip_count]}".red

					if(!(region.nil? || session[:region] == region))
						session[:news_skip_count] = 0
						session[:news_day_skip_count] = 0
						session[:region] = region
					end
					puts "2 #{session[:news_skip_count]} #{session[:news_day_skip_count]}".red
					
					info = Api::V0::FeedsApi.get_news(session[:news_skip_count], session[:news_day_skip_count], region).execute
					
					if info.blank?
						session[:news_day_skip_count] += 1
						session[:news_skip_count] = 0
						info = Api::V0::FeedsApi.get_news(session[:news_skip_count], session[:news_day_skip_count], region).execute
					end
					puts "3 #{session[:news_skip_count]} #{session[:news_day_skip_count]}".red
					puts "4 #{session[:news_skip_count]} #{session[:news_day_skip_count]}".red
				end
				session[:news_skip_count] += info.length
				redis_param =
				{
					:id 	=> session["session_id"],
					:info 	=>
					{
						:news_skip_count => session[:news_skip_count]
					}
				}
				RedisHelper::Session.set_session(redis_param);
				render :json => info, :status => 200
			end

			def last_blog
				info = Api::V0::FeedsApi.last_blog.execute
				render :json => info, :status => 200
			end

		end
	end
end