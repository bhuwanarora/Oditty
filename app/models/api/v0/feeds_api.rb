module Api
	module V0
		class FeedsApi

			def self.get_feed(user_id, params)
				Api::V0::NewsApi.get_feed(user_id, params)
			end

			def self.get_news skip_count, day_skip_count, region
				News.get_feed(skip_count, day_skip_count, region)
			end

			def self.get_blog skip_count, multiple_blog
				Blog.get_blog skip_count, multiple_blog
			end

			def self.last_blog
				Blog.get_latest_blog
			end

			def self.notify_borrow user_id, book_id
				UsersUser.notify_borrow user_id, user_id
			end
		end
	end
end
