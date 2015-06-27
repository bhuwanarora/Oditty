module Api
	module V0
		class PublisherApiController < ApplicationController

			def get_info
				id = params[:id]
				info = Api::V0::PublisherApi.get_info(id)
				render :json => info, :status => 200
			end

			def get_books
				id = params[:id]
				info = Api::V0::PublisherApi.get_books(id)
				render :json => info, :status => 200
			end
		end
	end
end