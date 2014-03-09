module Api
	module V0
		class SearchApiController < ApplicationController
			def search
				query_params = params[:q]
				results = {:message => "To do"}
				render :json => results, :status => 200
			end

		end
	end
end