module Api
	module V0
		class FeedsApi

			def self.get_feed(user_id, params)
				Api::V0::NewsApi.get_feed(user_id, params)
			end

			def self.get_news skip_count, day_skip_count
				News.get_feed(skip_count, day_skip_count)
			end

			def self.get_blog skip_count
				Blog.get_blog skip_count
			end

			def self.last_blog
				Blog.get_latest_blog
			end
		end
	end
end
