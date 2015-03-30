module Api
	module V0
		class InfinityApiController < ApplicationController
			def get_books
				category = params["category_id"] 
				author_id = params["author_id"] 
				time_id = params["time_id"] 
				era_id = params["era_id"] 
				skip_count = params["skip_count"] || 0
				info = Api::V0::InfinityApi.new(category, author_id, time_id, era_id, skip_count).get_books
				render :json => info, :status => 200
			end
		end
	end
end