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
				results = SearchApi.search(params[:q].to_s.strip, params[:count], "BOOK")
				render :json => {:results => results}, :status => 200
			end

			def search_authors
				results = SearchApi.search(params[:q].to_s.strip, params[:count], "AUTHOR")
				render :json => results, :status => 200
			end

			def search_genres
				results = SearchApi.search(params[:q].to_s.strip, params[:count], "GENRE")
				render :json => results, :status => 200
			end

			def search_users
				results = SearchApi.search(params[:q].to_s.strip, params[:count], "READER")
				render :json => results, :status => 200
			end

		end
	end
end