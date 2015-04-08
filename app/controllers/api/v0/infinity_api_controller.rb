module Api
	module V0
		class InfinityApiController < ApplicationController
			def get_books
				filters = params["q"]
				info = Api::V0::InfinityApi.get_books filters
				render :json => info, :status => 200
			end
		end
	end
end