module Api
	module V0
		class FilterApiController < ApplicationController

			def get_filtered_books
				user_id = session[:user_id]
				info = Api::V0::FeedsApi.get_feed(user_id, params)
				render :json => info, :status => 200
			end
		end
	end
end