module Api
	module V0
		class StatusApiController < ApplicationController
			def create
				user_id = session[:user_id] 
				info = Api::V0::StatusApi.create(user_id, params).execute
				render :json => info, :status => 200
			end
		end
	end
end