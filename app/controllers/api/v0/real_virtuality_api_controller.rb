module Api
	module V0
		class RealVirtualityApiController < ApplicationController

			def book_news
				id = params[:id]
				info = Api::V0::RealVirtualityApi.get_news(id).execute
				render :json => info, :status => 200
			end
		end
	end
end