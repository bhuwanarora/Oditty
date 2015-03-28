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
				unless content.nil?
					Api::V0::StatusApi.new(user_id, content, book_id, status, mentioned_users_ids, mentioned_authors_ids, hashtags, feelings, exchange_status).create.execute
					info = " Success "
					status = 200
				else
					info = " Failure "
					status = 404
				end
				render :json => info, :status => status
			end
		end
	end
end