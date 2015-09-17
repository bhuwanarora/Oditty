module Api
	module V0
		class NewsApiController < ApplicationController
			def create
				Api::V0::NewsApi.add_news params
				render :json => {:message => "Success"}, :status => 200
			end
		end
	end
end