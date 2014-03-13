module Api
	module V0
		class WebsiteApiController < ApplicationController
			def genres
				filter = params[:q]
				genres = [{:name => "Philosophy", :id => 1}, {:name => "Arts", :id => 2}]
				results = {:genres => genres}
				render :json => results, :status => 200
			end

			def countries
				filter = params[:q]
				countries = [{:name => "India", :id => 1}, {:name => "United States Of America", :id => 2}]
				results = {:countries => countries}
				render :json => results, :status => 200
			end

		end
	end
end