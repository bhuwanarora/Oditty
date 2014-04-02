module Api
	module V0
		class WebsiteApiController < ApplicationController
			def genres
				filter = params[:q]
				genres = [{:name => "Philosophy", :id => 1}, 
						  {:name => "Arts", :id => 2},
						  {:name => "Music", :id => 3},
						  {:name => "Fiction", :id => 4},
						  {:name => "Non-fiction", :id => 5}]
				results = {:genres => genres}
				render :json => results, :status => 200
			end

			def countries
				filter = params[:q]
				countries = [{:name => "India", :id => 1}, {:name => "United States Of America", :id => 2}]
				results = {:countries => countries}
				render :json => results, :status => 200
			end

			def get_user_details
				# user_id = params[:user_id]
				
				bookmarked_books = BookApi.bookmarked_books
				read_books = []
				render :json => {:books => {:bookmarked => bookmarked_books, :read => read_books}}, :status => 200
			end

			def authenticate
				render :json => {:message => "success", :profile_status => 0, :user_id => 1}, :status => 200
			end

			def update_profile
				profile_status = params[:user['profile_status']]
				profile_status = profile_status + 1;
				render :json => {:message => "success", :profile_status => profile_status, :user_id => 1}, :status => 200
			end

		end
	end
end