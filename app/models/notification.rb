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
			if type == "User"
			elsif type == "MarkAsReadNode"
				notification = _mark_as_read_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "RatingNode"
				notification = _rating_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "TimingNode"
				notification = _timing_node_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "Tweet"
				notification = _comment_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "BookmarkNode"
				notification = _bookmark_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "Visited"
				notification = _bookmark_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "ThumbRequest"
				notification = _thumb_request_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "RecommendNode"
				notification = _recommend_notification feed
				notifications.push(notification.merge!("label" => type))
			elsif type == "StatusNode"
				notification = _share_notification feed
				notifications.push(notification.merge!("label" => type))
			end
		end
		notifications
	end

	def _share_notification data
		name = _get_name data
		message = "<span> "+data["content"].to_s+" </span>"
		notification(message, data)
	end

	def _recommend_notification data
		name = _get_name data
		# message = "<span> recommended </span><span class='site_color'>"+data["title"]+"</span><span> to "+data["friend_name"]+".</span>"
		message = ""
		notification(message, data)
	end

	def _thumb_request_notification data
		name = _get_name data
		# message = "<span> suggested thumbnail for </span><span class='site_color'>"+data["title"]+".</span>"
		message = ""
		notification(message, data)
	end

	def _bookmark_notification data
		name = _get_name data
		# message = "<span> saved </span><span class='site_color'>"+data["title"]+"</span><span>&nbsp;to </span><span>"+data["label"].downcase.camelcase+".</span>"
		message = ""
		notification(message, data)
	end

	def _rating_notification data
		name = _get_name data
		# message = "<span> gave "+data["rating"].to_s+"/10 stars to </span><span class='site_color'>"+data["title"]+".</span>"
		message = ""
		notification(message, data)
	end

	def _timing_node_notification data
		name = _get_name data
		book_length_string = _get_time_index data["time_index"]
		# message = "<span> described reading length of <span class='site_color'>"+data["title"]+"</span>&nbsp; as a '"+book_length_string+"'. </span>"
		message = ""
		notification(message, data)
	end

	def _mark_as_read_notification data
		name = _get_name data
		# message = "<span> added </span><span class='site_color'>"+data["title"]+"</span><span> to &nbsp;</span><span class='icon-books'></span><span>&nbsp;Books Read.</span>"
		message = ""
		notification(message, data)
	end

	def notification(message, data, tag=nil)
		name = _get_name data
		thumb = "assets/profile_pic.jpeg"
		notification_json = {
			:created_at => data["created_at"],
			:user => {
				:id => data["user_id"],
				:name => data["name"]
			},
			:node => {
				:key => data["key"],
				:content => data["content"]
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

	def _get_name data
		if data["name"]
			name = data["name"]
		else
			name = data["email"]
		end
		name
	end
end