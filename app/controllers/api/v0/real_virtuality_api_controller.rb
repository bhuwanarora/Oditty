module Api
	module V0
		class RealVirtualityApiController < ApplicationController

			def book_news
				id = params[:id]
				info = Api::V0::RealVirtualityApi.get_news(id).execute[0]
				render :json => info, :status => 200
			end

			def community_news
				skip_count = params[:skip] || 0
				community_id = params[:id]
				info = Api::V0::RealVirtualityApi.get_news_community(community_id,skip_count).execute
				render :json => info, :status => 200
			end
		end
	end
end