module Api
	module V0
		class SearchApiController < ApplicationController

			def search
				query_params = params[:q].strip
				count = params[:count].to_i
				type = params[:type]
				puts query_params.to_s.white
				puts session[:query].to_s.white
				puts session[:query_type].to_s.white
				puts type.to_s.white
				unless session[:query] == query_params and session[:query_type] == type
					results = SearchApi.search(params)
					session[:query] = query_params
					session[:query_type] = type
					session[:scroll_id] = results["scroll_id"] if results["scroll_id"].present?
					results = results["results"]
				else
					results = SearchApi.search_by_scroll_id(session[:scroll_id])["results"]
					session[:scroll_id] = results["scroll_id"] if (results.present? && results["scroll_id"].present?)
				end
				puts results.to_s.green
				render :json => results, :status => 200
			end
		end
	end
end