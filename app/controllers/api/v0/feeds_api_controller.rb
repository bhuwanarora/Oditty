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
				session[:news_skip_count] += info.length
				puts "4 #{session[:news_skip_count]} #{session[:news_day_skip_count]}".red
				render :json => info, :status => 200
			end

			def last_blog
				info = Api::V0::FeedsApi.last_blog.execute
				render :json => info, :status => 200
			end

		end
	end
end