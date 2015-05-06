module Api
	module V0
		class SearchApiController < ApplicationController

			def search
				query_params = params[:q].strip
				count = params[:count].to_i
				type = params[:type]
				results = SearchApi.search(params)
				render :json => results, :status => 200
			end
		end
	end
end