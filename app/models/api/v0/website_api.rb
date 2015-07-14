module Api
	module V0
		class WebsiteApi

			def self.publishers_info id
				info = Publisher.new(id).get_info.execute
				info
			end

			def self.get_genre_details id
				info = Genre.new(id).get_basic_details.execute[0]
				info
			end

			def self.get_genres user_id
				User::Predict::GenrePrediction.new(user_id).get_favourites.execute
			end

			def self.save_feedback(feedback, user_id)
				clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" CREATE (u)-[:GaveFeedback]->(f:Feedback) SET f.feedback_text=\""+feedback+"\", f.timestamp="+Time.now.to_i.to_s
				clause.execute
			end

			def self.add_new_label user_id, label, type
				UsersLabel.create_new(user_id, label, type)
			end

			def self.add_label user_id, label
				UsersLabel.create(user_id, label)
			end

			def self.get_labels user_id
				labels = []
				if user_id.present?
					labels = User.new(user_id).get_public_labels.execute
				end
				labels
			end

			def self.get_important_community_info id, community_id = nil
				if community_id
					clause = Community.new(community_id).get_books_users + " WITH most_important_tag " + Community.new(community_id).match_news_related_communities(id)
				else
					clause = Article::NewsArticle.new(id).most_important_tag_info + Article::NewsArticle.new(id).other_tags_info
				end
				clause
			end

			def self.get_chronological_news_info id
				Article::NewsArticle.new(id).get_chronological_news_info
			end

			def self.get_basic_community_info community_id
				Community.new(community_id).books_users_info
			end

			def self.get_feed_community_info community_id
				Community.new(community_id).feed_info
			end

			def self.get_news_feed(user_id, skip_count)
				news_feed = User::Feed.new(user_id).get_news_feed(skip_count)
				begin
					notifications = FeedStructure.execute(news_feed)
				rescue Exception => e
					notifications = []
				end
				notifications
			end

			def self.get_personal_feed(user_id, skip_count)
				news_feed = User::Feed.new(user_id).get_personal_feed(skip_count).execute
				notifications = FeedStructure.new(news_feed).execute
				notifications
			end

			def self.get_latest_notification user_id

			end

			def self.get_time_groups
                time_groups = "MATCH (t:Era) RETURN t.name as name, t.range as range, ID(t) as id"
                time_groups.execute
			end

			def self.get_regions
				News.get_regions
			end

		end
	end
end