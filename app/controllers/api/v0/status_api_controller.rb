module Api
	module V0
		class StatusApiController < ApplicationController
			def create
				user_id = session[:user_id] 
				status = params[:status] 
				book_id = params[:book_id] 
				mentioned_users_ids = params[:mentioned_users_ids] 
				hashtags = params[:hashtags]
				mentioned_authors_ids = params[:mentioned_authors_ids]
				content = params[:content]
				feelings = params[:feelings]
				exchange_status = params[:exchange_status] 
				Api::V0::StatusApi.create(user_id, book_id, status, mentioned_users_ids, mentioned_authors_ids, hashtags, content, feelings, exchange_status)
				info = " Status Updated "
				render :json => info, :status => 200
			end

		end
	end
end