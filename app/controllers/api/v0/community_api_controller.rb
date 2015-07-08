module Api
	module V0
		class CommunityApiController < ApplicationController
			def get_books
				id = params["id"]
				key = "GB" + id.to_s
				info = $redis.get key
				unless info
					info = Api::V0::CommunityApi.get_books(id).execute[0]
					$redis.set(key, info.to_json)
				else
					info = JSON.parse info
				end
				render :json => info, :status => 200
			end

			def popular_communities
				info = Api::V0::CommunityApi.get_popular_communities.execute
				render :json => info, :status => 200				
			end

			def suggest_communities
				user_id = session[:user_id]
				info = $redis.get 'trends'
				unless info
					info = Api::V0::CommunityApi.suggest_communities(user_id).execute
					$redis.set('trends', info.to_json)
					$redis.expire('trends', 86400)
				else
					info = JSON.parse info
				end

				render :json => info, :status => 200
			end

			def top_communities
				user_id = session[:user_id]
				skip_count = params[:skip] || 0
				info = Api::V0::CommunityApi.top_communities(user_id, skip_count).execute
				render :json => info, :status => 200
			end

			def detailed_community_info
				community_id = params[:id]
				user_id = session[:user_id]
				info = Api::V0::CommunityApi.get_detailed_info(community_id, user_id).execute[0]
				render :json => info, :status => 200 
			end

			def self.create_visited_news 
				news_id = params[:news_id]
				user_id = session[:user_id]
				Api::V0::CommunityApi.create_visited_news(user_id, news_id)
			end
		end
	end
end