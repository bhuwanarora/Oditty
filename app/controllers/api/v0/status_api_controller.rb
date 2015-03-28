module Api
	module V0
		class StatusApiController < ApplicationController
			def create
				user_id = session[:user_id] 
				status = params[:status] || 0
				book_id = params[:book_id] || 1
				mentioned_users_ids = params[:mentioned_users_ids] || [1,2]
				hashtags = params[:hashtags] || ["asd","asdsa"]
				mentioned_authors_ids = params[:mentioned_authors_ids] || [2,3]
				content = params[:content] || "safdasdf"
				feelings = params[:feelings] || ["asdfasd","asdfasd"]
				exchange_status = params[:exchange_status] || 2
				Api::V0::StatusApi.create(user_id, book_id, status, mentioned_users_ids, mentioned_authors_ids, hashtags, content, feelings, exchange_status)
				info = " Status Updated "
				render :json => info, :status => 200
			end

		end
	end
end