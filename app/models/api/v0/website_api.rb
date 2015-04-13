module Api
	module V0
		class WebsiteApi
			def self.save_feedback(feedback, user_id)
				clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" CREATE (u)-[:GaveFeedback]->(f:Feedback) SET f.feedback_text=\""+feedback+"\", f.timestamp="+Time.now.to_i.to_s
				clause.execute
			end

			def self.get_labels user_id
				labels = []
				if user_id.present?
					labels = User.new(user_id).get_public_labels.execute
				end
				labels
			end

			def self.get_important_community_info id
				Article::NewsArticle.new(id).most_important_tag_info + Article::NewsArticle.new(id).other_tags_info
			end

			def self.get_chronological_news_info id
				Article::NewsArticle.new(id).get_chronological_news_info
			end

			def self.get_basic_community_info news_id
				Community.new(news_id).books_users_info
			end

			def self.get_news_feed(user_id, skip_count)
				news_feed = User::Feed.new(user_id).get_news_feed(skip_count)
				begin
					notifications = Notification.structure_feed news_feed
				rescue Exception => e
					notifications = []
				end
				notifications
			end

			def self.get_personal_feed(user_id, skip_count)
				news_feed = User::Feed.new(user_id).get_personal_feed(skip_count).execute
				notifications = Notification.new(news_feed).structure_feed
				notifications
			end

			def self.get_latest_notification user_id

			end

			def self.get_time_groups
                time_groups = "MATCH (t:Era) RETURN t.name as name, t.range as range, ID(t) as id"
                time_groups.execute
			end
		end
	end
end