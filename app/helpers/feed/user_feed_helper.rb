module Feed::UserFeedHelper
	
	def self.update_redis_on_create(feed_id, user_id)
		clause = ""\
			" MATCH (feed) "\
			" WHERE ID(feed) =" + feed_id.to_s + " "\
			" RETURN feed "
		begin
			output_neo = clause.execute[0]["feed"]
			output = {'data' => {}, 'feed_id' => feed_id, 'user_id' => user_id }
			output_neo["data"].each {|key,value| output['data'][key] = value}
			output["data"]["label"] = output_neo["metadata"]["labels"]
			Net::HTTP.post_form(URI.parse(Rails.application.config.feed_service + "/api/v0/add_feed"), "params" => output.to_json)
		rescue Exception => e
			puts e.to_s.red
		end
	end

	def self.update_redis_on_update feed_id, user_id
		Feed::UserFeedHelper.update_redis_on_create feed_id, user_id
	end

	def self.update_redis_on_delete(feed_id, user_id)
		Net::HTTP.get(URI.parse(Rails.application.config.feed_service + "/api/v0/delete_feed?feed_id=" + feed_id.to_s + "&" + "user_id=" + user_id.to_s))
	end

	def self.handle_redis params, node_label
		feed_id = nil
		case node_label
		when Constant::NodeLabel::FollowsNode
			feed_id = Feed::UserFeedHelper.get_follows_node_id params
		when Constant::NodeLabel::BookmarkNode
			feed_id = Feed::UserFeedHelper.get_bookmark_node_id params
		when Constant::NodeLabel::StatusNode
			feed_id = Feed::UserFeedHelper.get_status_node_id params
		when Constant::NodeLabel::EndorseNode
			feed_id = Feed::UserFeedHelper.get_endorse_node_id params
		when Constant::NodeLabel::RatingNode
			feed_id = Feed::UserFeedHelper.get_rating_node_id params
		end
		Feed::UserFeedHelper.handle_action feed_id, user_id, params[:action]
	end

	def self.get_follows_node_id params
		feed_id = nil
		if params[:author_id].present?
			feed_id = (UsersAuthor.new(params[:author_id], params[:user_id]).match + UsersAuthor.match + " RETURN ID(follows_node) AS id ").execute[0]["id"]
		elsif params[:friend_id].present?
			feed_id = (UsersUser.new(user_id, friend_id).match + " RETURN ID(follows_node) AS id").execute[0]["id"]
		elsif params[:community_id].present?
			feed_id = (UsersCommunity.new(params[:user_id], params[:community_id]).match + UsersCommunity.match + " RETURN ID(follows_node) AS id").execute[0]["id"]
		end
		feed_id
	end

	def self.get_bookmark_node_id params
		(User.new(params[:user_id]).match + "MATCH (media) WHERE ID(media) = " + params[:media_id].to_s + Bookmark.match("media") + " RETURN ID(bookmark_node) AS id ").execute[0]["id"]
	end

	def self.get_status_node_id params
		params[:feed_id]
	end

	def self.get_endorse_node_id params
		(UsersBook.new(params[:book_id],params[:user_id]).match + " WITH user, book " + UsersBook::Endorse.match + " RETURN ID(endose) AS id ").execute[0][id]
	end

	def self.get_rating_node_id params
		(UsersBook.new(params[:book_id],params[:user_id]).match + " WITH user, book ") + UsersBook.match_rating + " RETURN ID(rating_node) AS id").execute[0]["id"]
	end

	def self.handle_action feed_id, user_id, action
		case action
		when Feed::ActionCreate
			Feed::UserFeedHelper.update_redis_on_create feed_id, user_id
		when Feed::ActionUpdate
			Feed::UserFeedHelper.update_redis_on_update feed_id, user_id
		when Feed::ActionDelete
			Feed::UserFeedHelper.update_redis_on_delete feed_id, user_id
		end
	end
end