module Api
	module V0
		class SearchApiController < ApplicationController

			def search
				query_params = params[:q].strip
				count = params[:count].to_i
				type = params[:type]
				unless session[:query] == query_params
					resposne = SearchApi.search(params)
					session[:query] = @search_text
					results = resposne["results"]
					session[:scroll_id] = resposne["scroll_id"] if scroll_id.present?
				else
					results = SearchApi.search_by_scroll_id["results"]
				end
				render :json => results, :status => 200
			end
		end
	end
end