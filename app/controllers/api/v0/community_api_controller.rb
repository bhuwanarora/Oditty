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

			def add_book
				id = params[:id]
				book_id = params[:book_id]
				user_id = session[:user_id]
				if user_id
					info = Api::V0::CommunityApi.add_book(id, book_id, user_id)
					key = "BCI" + id.to_s
					$redis.del key
				end
				render :json => {:message => "Success"}, :status => 200
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
				info = Api::V0::CommunityApi.get_detailed_info(community_id, user_id)
				render :json => info, :status => 200 
			end

			def self.create_visited_news 
				news_id = params[:news_id]
				user_id = session[:user_id]
				Api::V0::CommunityApi.create_visited_news(user_id, news_id)
			end

			def get_news
				id = params[:id]
				skip_count = params[:skip]
				info = Api::V0::CommunityApi.get_news(id, skip_count)
				render :json => info, :status => 200
			end

			def get_videos
				id = params[:id]
				key = "GV"+id.to_s
				info = $redis.get key
				unless info
					info = Api::V0::CommunityApi.get_videos(id)
					$redis.set(key, info.to_json)
				else
					info = JSON.parse info
				end
				render :json => info, :status => 200
			end

			def get_rooms
				user_id = session[:user_id]
				skip_count = params[:skip] || 0
				info = nil
				status = 200
				begin
					info = Api::V0::CommunityApi.get_rooms user_id, skip_count
				rescue Exception => e
					puts e.to_s.red
					info = e.to_s
					status = 500
				end
				render :json => info, :status => status

			end
		end
	end
end