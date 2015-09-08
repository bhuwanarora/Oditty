module FeedHelper::UserFeedHelper
	
	def self.get_api_suffix params
		update_action 	= params[:update]
		notification 	= params[:notification]
		if notification
			suffix = "api/v0/add_notification"
		else
			suffix = (update_action == true) ? ("/api/v0/update_feed") : ("/api/v0/add_feed")
		end
		suffix
	end

	def self.update_redis_on_create params
		id 				= params[:id]
		user_id 		= params[:user_id]

		api_string = FeedHelper::UserFeedHelper.get_api_suffix params
		clause = ""\
			" MATCH (feed) "\
			" WHERE ID(feed) =" + id.to_s + " "\
			" RETURN COLLECT(LABELS(feed)) AS labels, feed "
		begin
			output_neo = clause.execute[0]
			output = {'data' => {}, 'id' => id, 'user_id' => user_id }
			output_neo["feed"]["data"].each {|key,value| output['data'][key] = value}
			output["data"]["label"] = output_neo["labels"][0]
			url = Rails.application.config.feed_service + api_string
			Net::HTTP.post_form(URI.parse(url), "params" => output.to_json)
		rescue Exception => e
			puts e.to_s.red
		end
	end

	def self.update_redis_on_update params
		params[:update] = true
		FeedHelper::UserFeedHelper.update_redis_on_create params
	end

	def self.update_redis_on_delete params
		feed_id = params[:id]
		user_id = params[:user_id]
		Net::HTTP.get(URI.parse(Rails.application.config.feed_service + "/api/v0/delete_feed?feed_id=" + feed_id.to_s + "&" + "user_id=" + user_id.to_s))
	end

	def self.handle_redis params, node_label
		id = nil
		case node_label
		when Constant::NodeLabel::FollowsNode
			id = FeedHelper::UserFeedHelper.get_follows_node_id params
		when Constant::NodeLabel::BookmarkNode
			id = FeedHelper::UserFeedHelper.get_bookmark_node_id params
		when Constant::NodeLabel::StatusNode
			id = FeedHelper::UserFeedHelper.get_status_node_id params
		when Constant::NodeLabel::EndorseNode
			id = FeedHelper::UserFeedHelper.get_endorse_node_id params
		when Constant::NodeLabel::RatingNode
			id = FeedHelper::UserFeedHelper.get_rating_node_id params
		end
		if id.present?
			FeedHelper::UserFeedHelper.handle_action(id, params[:user_id], params[:action])
		else
			# Below two are exlusively for notification
			case node_label
			when Constant::NodeLabel::BorrowNode
				id = FeedHelper::UserFeedHelper.get_borrow_node_id params
			when Constant::NodeLabel::RecommendNode
				id = FeedHelper::UserFeedHelper.get_recommends_node_id params
			end
			FeedHelper::UserFeedHelper.handle_notification_action(id, params[:user_id], params[:action]) if id.present?
		end
	end

	def self.get_follows_node_id params
		feed_id = nil
		if params[:author_id].present?
			feed_id = (UsersAuthor.new(params[:author_id], params[:user_id]).match + UsersAuthor.match + ", follows_node RETURN ID(follows_node) AS id ").execute[0]["id"]
		elsif params[:friend_id].present?
			feed_id = (UsersUser.new(params[:user_id], params[:friend_id]).match + " RETURN ID(follows_node) AS id").execute[0]["id"]
		elsif params[:community_id].present?
			feed_id = (UsersCommunity.new(params[:user_id], params[:community_id]).match + UsersCommunity.match + " RETURN ID(follows_node) AS id").execute[0]["id"]
		end
		feed_id
	end

	def self.get_bookmark_node_id params
		(User.new(params[:user_id]).match + " MATCH (media) WHERE ID(media) = " + params[:media_id].to_s + Bookmark.match("media") + ""\
		" WHERE label.key <>\'Visited\' AND label.key <>\'FromFacebook\' "\
		" RETURN ID(bookmark_node) AS id ").execute[0]["id"]
	end

	def self.get_status_node_id params
		params[:feed_id]
	end

	def self.get_endorse_node_id params
		(UsersBook.new(params[:book_id],params[:user_id]).match + UsersBook::Endorse.match + " RETURN ID(endorse) AS id ").execute[0]["id"]
	end

	def self.get_borrow_node_id params
		params[:id]
	end

	def self.get_recommends_node_id params
		params[:id]
	end

	def self.get_rating_node_id params
		(UsersBook.new(params[:book_id],params[:user_id]).match + UsersBook.match_rating + " RETURN ID(rating_node) AS id").execute[0]["id"]
	end

	def self.handle_action feed_id, user_id, action
		params = {:id => feed_id, :user_id => user_id}
		case action
		when FeedHelper::ActionCreate
			FeedHelper::UserFeedHelper.update_redis_on_create params
		when FeedHelper::ActionUpdate
			FeedHelper::UserFeedHelper.update_redis_on_update params
		when FeedHelper::ActionDelete
			FeedHelper::UserFeedHelper.update_redis_on_delete params
		end
	end

	def self.handle_notification_action notification_id, user_id, action
		#action is ignored for now.
		FeedHelper::UserFeedHelper.update_redis_on_create({:id => notification_id, :user_id => user_id, :notification => true})
	end
end