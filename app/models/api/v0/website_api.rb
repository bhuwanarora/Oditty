module Api
	module V0
		class WebsiteApi
			def self.get_labels
				neo_init
				labels = @neo.execute_query("MATCH (l:Label) RETURN l")["data"]
				output_labels = []
				for label in labels do
					output_labels.push label[0]["data"]
				end
				output_labels
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