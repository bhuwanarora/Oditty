class Notification < Neo
	def initialize news_feed
		structure_feed = []
		for feed in news_feed
			feed_data = feed["feed"]["data"] rescue {}
			feed = feed_data.merge("label" => feed["labels"][0])
			structure_feed.push feed
		end
		@news_feed = structure_feed
	end

	def structure_feed
		notifications = []
		for feed in @news_feed
			type = feed["label"]
			puts type.green
			if type == "EndorseNode"
				notification = _endorse_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "FollowNode"
				notification = _follow_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "MentionNode"
				notification = _mention_notification feed
				notifications.push(notification.merge!("label" => type))
			end
		end

		notifications
	end

	def _endorse_notification data
		structure_notification(data)
	end

	def _mention_notification data
		structure_notification(data)
	end

	def _follow_notification data
		structure_notification(data)
	end

	def structure_notification(data, tag=nil)
		name = data["first_name"] + " " + data["last_name"]
		thumb = "assets/profile_pic.jpeg"
		notification_json = {
			:created_at => data["created_at"],
			:user => {
				:id => data["user_id"],
				:name => data["name"]
			},
			:node => {
				:key => data["key"],
				:content => data["content"],
				:wrapper_content => data["wrapper_content"]
			}
		}
		if tag.present?
			notification_json.merge!("tag" => tag)
		end
		if data["book_id"].present?
			notification_json.merge!(:book => {:id => data["book_id"]})
		end
		notification_json
	end

	def _comment_notification data
		name = _get_name data
		message = "<span>"+data["tweet"]+".</span>";

		tag = "<div class='"+data["icon"]+" inline_block'></div>" rescue ""
		clause = "<div class='inline_block'> is "+data["label1"] rescue "<div class='inline_block'> "
		tag = tag + clause

		clause = " "+data["label2"]+" " rescue " "
		tag = tag + clause

		clause = "<span class='site_color'>"+data["title"]+"</span>.</div>" rescue "</div>"
		tag = tag + clause


		notification(message, data, tag)
	end

	def _get_time_index time_index
		output = ""
		if time_index == 0
			output = "tiny read"
		elsif time_index == 1
			output = "small read"
		elsif time_index == 2
			output = "normal read"
		elsif time_index == 3
			output = "long read"
		end
		output
	end

	def self.match_path
		" MATCH path = (latest_notification)-[:Notification*]->(last_seen_notification) WITH path, last_seen_notification, latest_notification  "
	end

	def self.reset_last_seen
		" MERGE (user)-[:SawNotification]-(latest_notification) DELETE saw_notification WITH user, latest_notification "
	end

	def self.basic_info
		" LABELS(notification) AS label, notification.created_at AS created_at "
	end

	def self.optional_match_book_user
		" OPTIONAL MATCH (user:User)-->(notification) OPTIONAL MATCH (notification)-->(book:Book) WITH user, book, notification "
	end

	def self.handle_last_seen
		User.match_latest_notification +  User.match_last_seen_notification  + ", latest_notification " + Notification.reset_last_seen + ", last_seen_notification "
	end

	def self.handle_unseen
		Notification.handle_last_seen + Notification.match_path + "," + Notification.extract_unwind("notification") + ", last_seen_notification WHERE notification <> last_seen_notification "
	end
end