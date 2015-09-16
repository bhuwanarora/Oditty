module Api
	module V0
		class CommunityApi

			def self.get_popular_communities
				CommunityInterface.get_popular_communities
			end

			def self.create_visited_news user_id, news_id
				News.new(news_id).create_visited(user_id)
			end

			def self.get_combined_details id
				CommunityInterface.get_combined_details(id)
			end

			def self.suggest_communities user_id
				clause = User::Suggest::CommunitySuggestion.get_trending_communities
			end

			def self.add_book id, book_id, user_id
				CommunityInterface.add_book(id, book_id, user_id)
			end

			def self.top_communities user_id, skip_count
				CommunityInterface.top_communities(user_id, skip_count)
			end

			def self.get_detailed_info(id, user_id)
				CommunityInterface.get_detailed_info(id, user_id)
			end

			def self.get_books id
				CommunityInterface.get_books(id)
			end

			def self.get_news(id, skip_count)
				CommunityInterface.get_news(id, skip_count)
			end

			def self.get_videos(id)
				CommunityInterface.get_videos(id)
			end

			def self.get_rooms user_id, skip_count
				CommunityInterface.get_rooms(user_id, skip_count)
			end
		end
	end
end