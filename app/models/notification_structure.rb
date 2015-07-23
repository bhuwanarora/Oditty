class NotificationStructure < Neo
	def initialize notifications
		notifications_formatted = []
		notifications.each do |notification|
			temp = {:notification => notification["notification"]["data"],
					:label => notification["label"],
					:created_at => notification["created_at"]}
			notifications_formatted << temp
		end
		@notifications = notifications_formatted
	end

	def execute
		notifications_formatted = []
		@notifications.each do |notification|
			type = notification[:label][0]
			if type == Constant::NodeLabel::FollowsNode
				notifications_formatted << get_notification_follows_node(notification)
			elsif type == Constant::NodeLabel::RecommendNode
				notifications_formatted << get_notification_recommend_node(notification)
			elsif type == Constant::NodeLabel::BorrowNode
				notifications_formatted << get_notification_borrow_node(notification)
			end
		end
		notifications_formatted
	end

	def get_notification_follows_node notification
		temp = {
				:friend_id => notification[:notification]["user_id"],
				:user_id => notification[:notification]["friend_id"],
				:created_at => notification[:created_at],
			}
		notification[:notification] = temp
		notification
	end

	def get_notification_recommend_node notification
		temp = {
			:friend_id => notification[:notification]["user_id"],
			:book_id => notification[:notification]["book_id"],
			:user_id => notification[:notification]["friend_id"],
			:timestamp => notification[:notification]["timestamp"]
		}
		notification[:notification] = temp
		notification
	end

	def get_notification_borrow_node notification
		temp = {
			:book_id => notification[:notification]["book_id"],
			:user_id => notification[:notification]["user_id"],
			:timestamp => notification[:notification]["timestamp"]
		}
		notification[:notification] = temp
		notification
	end
end