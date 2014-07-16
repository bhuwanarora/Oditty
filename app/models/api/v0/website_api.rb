include UsersGraphHelper
module Api
	module V0
		class WebsiteApi
			def self.get_labels user_id
				neo_init
				labels = UsersGraphHelper.get_bookmark_labels user_id
				labels
			end

			def self.get_news_feed user_id
				news_feed = UsersGraphHelper.get_news_feed user_id
				notifications = []

				for feed in news_feed["data"]
					type = feed[0][0]
					data = feed[1]["data"]
					if type == "User"
					elsif type == "MarkAsReadNode"
						notification = self.mark_as_read_notification data
						notifications.push notification
					end
				end
				notifications
			end

			def self.get_time_groups
				neo_init
                time_groups = @neo.execute_query("MATCH (t:Era) RETURN t")["data"]
                time_groups
			end

			private
			def self.neo_init
				@neo = Neography::Rest.new
			end

			def self.mark_as_read_notification data
				message = "<span><b>"+data["name"]+"</b> added </span><span class='site_color'><em>"+data["title"]+" by "+data["author"]+"</em></span><span> to &nbsp;</span><span class='icon-books'></span><span>&nbsp;books read.</span>"
				thumb = "assets/profile_pic.jpeg"
				notification = {
					:thumb => thumb,
					:message => message,
					:timestamp => data["timestamp"],
					:book => {
						:id => data["book_id"],
						:title => data["title"],
						:author_name => data["author"],
						:isbn => data["isbn"]
					},
					:user => {
						:id => data["user_id"],
						:name => data["name"]
					}
				}
				notification
			end
		end
	end
end