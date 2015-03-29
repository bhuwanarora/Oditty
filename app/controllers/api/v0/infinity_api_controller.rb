module Api
	module V0
		class InfinityApiConstroller < ApplicationController
			def get_books
				category = params["category_id"]
				author_id = params["author_id"] 
				time_id = params["time_id"]
				era_id = params["era_id"]
				info = Api::V0::InfinityApi.new(category, author_id, time_id, era_id).get_books
			end
		end
	end
end