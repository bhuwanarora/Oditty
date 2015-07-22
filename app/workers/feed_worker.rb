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
			when Feed::Create
				Feed::UserFeedHelper.update_redis_on_create(feed_id, user_id)
			when Feed::Update
				Feed::UserFeedHelper.update_redis_on_update(feed_id, user_id)
			when Feed::Delete
				Feed::UserFeedHelper.update_redis_on_delete(feed_id, user_id)
			end
		end
	end
end