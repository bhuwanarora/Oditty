module Api
	module V0
		class StatusApiController < ApplicationController
			def create
				user_id = session[:user_id]
				status = param[:status]
				book_id = params[:book_id]
				user_ids = params[:user_ids]
				hashtags = params[:hashtags]
				content = params[:content]
				feeligs = params[:feelings]
				exchange_status = params[:exchange_status]
				Api::V0::StatusApi.create(user_id, book_id, status, users_ids, authors_ids, hashtags, content, feelings, exchange_status)
				info = " Status Updated "
				render :json => info, :status => 200
			end

		end
	end
end