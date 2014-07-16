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
					elsif type == "Tweet"
						notification = self.comment_notification data
						notifications.push notification
					end
				end
				notifications.reverse
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
				if data["rating"] && data["time_index"]
					book_length_string = self.get_time_index data["time_index"]
					message = "<span><b>"+data["name"]+"</b> gave "+data["rating"].to_s+"/10 stars to "+book_length_string+" </span><span class='site_color'><em>"+data["title"]+"</em>.</span>"
				elsif data["rating"]
					message = "<span><b>"+data["name"]+"</b> gave "+data["rating"].to_s+"/10 stars to </span><span class='site_color'><em>"+data["title"]+"</em>.</span>"
				elsif data["time_index"]
					book_length_string = self.get_time_index data["time_index"]
					message = "<span><b>"+data["name"]+"</b> added "+book_length_string+" </span><span class='site_color'><em>"+data["title"]+"</em> to &nbsp;</span><span class='icon-books'></span><span>&nbsp;Books Read.</span>"
				else
					message = "<span><b>"+data["name"]+"</b> added </span><span class='site_color'><em>"+data["title"]+"</em></span><span> to &nbsp;</span><span class='icon-books'></span><span>&nbsp;Books Read.</span>"
				end
				thumb = "assets/profile_pic.jpeg"
				notification = {
					:thumb => thumb,
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
				notification
			end

			def self.comment_notification data
				message = "<span><b>"+data["name"]+"</b> </span><span class='site_color'>"+data["tweet"]+"</span>";
				thumb = "assets/profile_pic.jpeg"
				notification = {
					:thumb => thumb,
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
				notification
			end

			def self.get_time_index time_index
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
		end
	end
end