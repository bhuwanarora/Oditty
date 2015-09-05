module Api
	module V0
		class CommunityApi

			def self.get_popular_communities
				Community.get_popular
			end

			def self.get_detailed_info(id, user_id)
				UsersCommunity.new(user_id, id).get_info.execute[0]
			end

			def self.create_visited_news user_id, news_id
				News.new(news_id).create_visited(user_id)
			end

			def self.get_combined_details id
				Community.new(id).get_combined_details.execute
			end

			def self.suggest_communities user_id
				# clause = User::Suggest::CommunitySuggestion.new(user_id).get_communities
				clause = User::Suggest::CommunitySuggestion.get_trending_communities
			end

			def self.add_book id, book_id, user_id
				@community = Community.new(id)
				clause = @community.match + @community.add_book(book_id, user_id)
				clause.execute
			end

			def self.top_communities user_id, skip_count
				if user_id
					clause  = UsersCommunity.top_communities  user_id, skip_count
				else
					clause = Community.top_communities skip_count
				end
				clause
			end

			def self.get_books id
				Community.new(id).get_books
			end

			def self.get_news(id, skip_count)
				Community.new(id).get_news(skip_count).execute
			end

			def self.get_videos(id)
				Community.new(id).get_videos.execute
			end

			def self.get_rooms user_id, skip_count
				clause = ""
				if user_id.present?
					clause = User.new(user_id).popular_rooms skip_count
				else
					clause = Community.get_most_viewed_rooms skip_count
				end
				clause.execute
			end
		end
	end
end