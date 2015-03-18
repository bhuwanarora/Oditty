include UsersGraphHelper
include NotificationHelper
module Api
	module V0
		class WebsiteApi
			def self.save_feedback(feedback, user_id)
				neo_init
				clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" CREATE (u)-[:GaveFeedback]->(f:Feedback) SET f.feedback_text=\""+feedback+"\", f.timestamp="+Time.now.to_i.to_s
				@neo.execute_query clause
			end

			def self.get_labels user_id
				labels = []
				if user_id.present?
					labels = UsersGraphHelper.get_bookmark_labels user_id
				end
				labels
			end

			def self.get_news_feed(user_id, skip_count)
				news_feed = UsersGraphHelper.get_news_feed(user_id, skip_count)
				begin
					notifications = NotificationHelper.structure_feed news_feed
				rescue Exception => e
					notifications = []
				end
				notifications
			end

			def self.get_personal_feed(user_id, skip_count)
				news_feed = UsersGraphHelper.get_personal_feed(user_id, skip_count)
				begin
					notifications = NotificationHelper.structure_feed news_feed
				rescue Exception => e
					notifications = []
				end
				notifications
			end

			def self.get_latest_notification user_id

			end

			def self.get_time_groups
				neo_init
                time_groups = @neo.execute_query("MATCH (t:Era) RETURN t.name as name, t.range as range, ID(t) as id")
                time_groups
			end

			def self.get_root_categories user_id=nil
				neo_init
				clause = "MATCH (category:Category) WHERE category.is_root = true WITH category OPTIONAL MATCH (category)<-[r:Likes]-(u:User) WHERE ID(u)="+user_id.to_s+" RETURN category.name as name, ID(category) as id, category.icon as icon, ID(r) as likes, category.aws_key as key LIMIT 28"
				puts clause.blue.on_red
				info = @neo.execute_query(clause)
				info
			end

			private
			def self.neo_init
				@neo = Neography::Rest.new
			end

			
		end
	end
end