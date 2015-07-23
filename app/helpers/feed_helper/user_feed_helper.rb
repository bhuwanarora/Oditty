module FeedHelper::UserFeedHelper
	
	def self.update_redis_on_create(feed_id, user_id, update = false)
		api_string = (update == false)?("/api/v0/add_feed"):("/api/v0/update_feed")
		clause = ""\
			" MATCH (feed) "\
			" WHERE ID(feed) =" + feed_id.to_s + " "\
			" RETURN COLLECT(LABELS(feed)) AS labels, feed "
		begin
			output_neo = clause.execute[0]
			output = {'data' => {}, 'feed_id' => feed_id, 'user_id' => user_id }
			output_neo["feed"]["data"].each {|key,value| output['data'][key] = value}
			output["data"]["label"] = output_neo["labels"][0]
			Net::HTTP.post_form(URI.parse(Rails.application.config.feed_service + "/api/v0/add_feed"), "params" => output.to_json)
		rescue Exception => e
			puts e.to_s.red
		end
	end

	def self.update_redis_on_update feed_id, user_id
		FeedHelper::UserFeedHelper.update_redis_on_create feed_id, user_id, true
	end

	def self.update_redis_on_delete(feed_id, user_id)
		Net::HTTP.get(URI.parse(Rails.application.config.feed_service + "/api/v0/delete_feed?feed_id=" + feed_id.to_s + "&" + "user_id=" + user_id.to_s))
	end

	def self.handle_redis params, node_label
		feed_id = nil
		case node_label
		when Constant::NodeLabel::FollowsNode
			feed_id = FeedHelper::UserFeedHelper.get_follows_node_id params
		when Constant::NodeLabel::BookmarkNode
			feed_id = FeedHelper::UserFeedHelper.get_bookmark_node_id params
		when Constant::NodeLabel::StatusNode
			feed_id = FeedHelper::UserFeedHelper.get_status_node_id params
		when Constant::NodeLabel::EndorseNode
			feed_id = FeedHelper::UserFeedHelper.get_endorse_node_id params
		when Constant::NodeLabel::RatingNode
			feed_id = FeedHelper::UserFeedHelper.get_rating_node_id params
		end
		FeedHelper::UserFeedHelper.handle_action feed_id, params[:user_id], params[:action]
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

	def self.get_rating_node_id params
		(UsersBook.new(params[:book_id],params[:user_id]).match + UsersBook.match_rating + " RETURN ID(rating_node) AS id").execute[0]["id"]
	end

	def self.handle_action feed_id, user_id, action
		case action
		when FeedHelper::ActionCreate
			FeedHelper::UserFeedHelper.update_redis_on_create feed_id, user_id
		when FeedHelper::ActionUpdate
			FeedHelper::UserFeedHelper.update_redis_on_update feed_id, user_id
		when FeedHelper::ActionDelete
			FeedHelper::UserFeedHelper.update_redis_on_delete feed_id, user_id
		end
	end
end