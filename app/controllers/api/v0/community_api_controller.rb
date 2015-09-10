module Api
	module V0
		class CommunityApiController < ApplicationController

			def get_books
				id = params["id"]
				key = "GB" + id.to_s
				info = RedisHelper::Community.get_books({:id => id})
				unless !info.nil?
					info = Api::V0::CommunityApi.get_books(id).execute[0]
					RedisHelper::Community.set_books({:id => id, :info => info})
				end
				render :json => info, :status => 200
			end

			def get_combined_details
				id = params[:id]
				info = Api::V0::CommunityApi.get_combined_details(id)
				render :json => info, :status => 200
			end

			def add_book
				id = params[:id]
				book_id = params[:book_id]
				user_id = session[:user_id]
				if user_id
					info = Api::V0::CommunityApi.add_book(id, book_id, user_id)
					RedisHelper::Community.delete_basic_info({:id => id})
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def add_videos
				id = params[:id]
				VideosWorker.perform_async(VideosWorker::WorkAddToCommunityAutomated,{:id => id})
				render :json => {:message => "Success"}, :status => 200
			end

			def popular_communities
				info = Api::V0::CommunityApi.get_popular_communities.execute
				render :json => info, :status => 200				
			end

			def suggest_communities
				user_id = session[:user_id]
				info = RedisHelper::Community.get_suggested({:id => user_id})
				unless !info.nil?
					info = Api::V0::CommunityApi.suggest_communities(user_id).execute
					RedisHelper::Community.set_suggested({:id =>user_id, :info => info})
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
				args = {:id => community_id, :view_count => info["view_count"]}
				RedisHelper::Community.increment_view_count(args)
				args[:work] = RedisHelper::WorkUpdateSuggestCommunities
				RedisWorker.perform_async(args)
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
				info = RedisHelper::Community.get_videos({:id => id})
				unless !info.nil?
					info = Api::V0::CommunityApi.get_videos(id)
					RedisHelper::Community.set_videos({:id => id, :info => info})
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