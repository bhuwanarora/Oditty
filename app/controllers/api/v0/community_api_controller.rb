module Api
	module V0
		class CommunityApiController < ApplicationController
			def get_books
				id = params["id"]
				info = Api::V0::CommunityApi.get_books(id).execute[0]
				render :json => info, :status => 200
			end
		end
	end
end