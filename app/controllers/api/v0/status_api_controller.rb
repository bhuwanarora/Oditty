module Api
	module V0
		class StatusApiController < ApplicationController
			def create
				user_id = session[:user_id] 
				status_info = JSON.parse params[:q] 
				info = Api::V0::StatusApi.create(user_id, status_info).execute
				render :json => {:message => "Success"}, :status => 200
			end
		end
	end
end