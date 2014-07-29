include UsersGraphHelper
include NotificationHelper
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
				notifications = NotificationHelper.structure_feed news_feed["data"]
				notifications
			end

			def self.get_latest_notification user_id

			end

			def self.get_time_groups
				neo_init
                time_groups = @neo.execute_query("MATCH (t:Era) RETURN t")["data"]
                time_groups
			end

			def self.get_root_categories
				neo_init
				clause = "MATCH (category:Category) WHERE category.icon IS NOT NULL AND category.icon <> '' RETURN category.name, ID(category), category.icon LIMIT 28"
				puts clause.blue.on_red
				info = @neo.execute_query(clause)["data"]
				info
			end

			private
			def self.neo_init
				@neo = Neography::Rest.new
			end

			
		end
	end
end