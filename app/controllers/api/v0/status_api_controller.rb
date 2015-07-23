module Api
	module V0
		class StatusApiController < ApplicationController
			def create
				user_id = session[:user_id] 
				info = Api::V0::StatusApi.create(user_id, params).execute
				debugger
				FeedHelper::UserFeedHelper.handle_redis({
					:user_id => user_id,
					:feed_id => info[0]["status_id"],
					:action => FeedHelper::ActionCreate
					}, Constant::NodeLabel::StatusNode)
				render :json => info, :status => 200
			end
		end
	end
end