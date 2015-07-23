class FeedWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :default

	def perform  params
		feed_id = params[:feed_id]
		user_id = params[:user_id]
		entity_type = params[:entity_type]
		action = params[:action]
		case entity_type
		when Constant::EntityLabel::User
			case action
			when FeedHelper::ActionCreate
				FeedHelper::UserFeedHelper.update_redis_on_create(feed_id, user_id)
			when FeedHelper::ActionUpdate
				FeedHelper::UserFeedHelper.update_redis_on_update(feed_id, user_id)
			when FeedHelper::ActionDelete
				FeedHelper::UserFeedHelper.update_redis_on_delete(feed_id, user_id)
			end
		end
	end
end