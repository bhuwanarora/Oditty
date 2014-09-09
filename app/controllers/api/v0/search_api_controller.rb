module Api
	module V0
		class SearchApiController < ApplicationController
			def search
				query_params = params[:q].strip
				count = params[:count].to_i
				type = params[:t]
				results = SearchApi.search(query_params, count, type)
				render :json => {:results => results}, :status => 200
			end

			def search_books
				results = SearchApi.search_books(params[:q].to_s.strip, session[:user_id])
				render :json => {:results => results}, :status => 200
			end

			def search_authors
				results = SearchApi.search_authors(params[:q].to_s.strip, session[:user_id], params[:genre_id])
				render :json => results, :status => 200
			end

			def search_genres
				results = SearchApi.search_genres(params[:q].to_s.strip, params[:count])
				render :json => results, :status => 200
			end

		end
	end
end