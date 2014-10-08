module NotificationHelper
	def self.structure_feed news_feed
		notifications = []
		for feed in news_feed
			type = feed[0][0]
			data = feed[1]["data"]
			if type == "User"
			elsif type == "MarkAsReadNode"
				notification = self._mark_as_read_notification data
				notifications.push notification
			elsif type == "RatingNode"
				notification = self._rating_notification data
				notifications.push notification
			elsif type == "TimingNode"
				notification = self._timing_node_notification data
				notifications.push notification
			elsif type == "Tweet"
				notification = self._comment_notification data
				notifications.push notification
			elsif type == "BookmarkNode"
				notification = self._bookmark_notification data
				notifications.push notification
			elsif type == "ThumbRequest"
				notification = self._thumb_request_notification data
				notifications.push notification
			elsif type == "RecommendNode"
				notification = self._recommend_notification data
				notifications.push notification
			end
		end
		notifications.reverse
	end

	def self._recommend_notification data
		name = self._get_name data
		message = "<span> recommended </span><span class='site_color'>"+data["title"]+" by "+data["author_name"]+"</span><span> to "+data["friend_name"]+".</span>"
		self.notification(message, data)
	end

	def self._thumb_request_notification data
		name = self._get_name data
		message = "<span> suggested thumbnail for </span><span class='site_color'>"+data["title"]+" by "+data["author_name"]+".</span>"
		self.notification(message, data)
	end

	def self._bookmark_notification data
		name = self._get_name data
		message = "<span> saved </span><span class='site_color'>"+data["title"]+" by "+data["author_name"]+"</span><span>&nbsp; to &nbsp;</span><span class='header_font'>"+data["label"].downcase.camelcase+".</span>"
		self.notification(message, data)
	end

	def self._rating_notification data
		name = self._get_name data
		message = "<span class='header_font'> gave "+data["rating"].to_s+"/10 stars to </span><span class='site_color'>"+data["title"]+" by "+data["author_name"]+".</span>"
		self.notification(message, data)
	end

	def self._timing_node_notification data
		name = self._get_name data
		book_length_string = self._get_time_index data["time_index"]
		message = "<span> described reading length of <span class='site_color'>"+data["title"]+" by "+data["author_name"]+"</span>&nbsp; as a '"+book_length_string+"'. </span>"
		self.notification(message, data)
	end

	def self._mark_as_read_notification data
		name = self._get_name data
		message = "<span> added </span><span class='site_color'>"+data["title"]+" by "+data["author_name"]+"</span><span> to &nbsp;</span><span class='icon-books'></span><span class='header_font'>&nbsp;Books Read.</span>"
		self.notification(message, data)
	end

	def self.notification(message, data, tag=nil)
		name = self._get_name data
		thumb = "assets/profile_pic.jpeg"
		notification_json = {
			:thumb => data["thumb"],
			:message => message,
			:timestamp => data["timestamp"],
			:book => {
				:id => data["book_id"],
				:title => data["title"],
				:author_name => data["author_name"],
				:isbn => data["isbn"]
			},
			:user => {
				:id => data["user_id"],
				:name => data["name"]
			}
		}
		if tag.present?
			notification_json.merge!("tag" => tag)
		end
		notification_json
	end

	def self._comment_notification data
		name = self._get_name data
		message = "<span>"+data["tweet"]+".</span>";

		tag = "<div class='"+data["icon"]+" inline_block'></div>" rescue ""
		clause = "<div class='inline_block site_color header_font'> "+data["label1"] rescue "<div class='inline_block'> "
		tag = tag + clause

		clause = " "+data["label2"]+" " rescue " "
		tag = tag + clause

		clause = data["title"]+" by "+data["author_name"]+".</div>" rescue "</div>"
		tag = tag + clause


		self.notification(message, data, tag)
	end

	def self._get_time_index time_index
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

	def self._get_name data
		if data["name"]
			name = data["name"]
		else
			name = data["email"]
		end
		name
	end
end