module Api
	module V0
		class FacebookApi

			def self.handle_facebook_likes fb_id
				FacebookLikesWorker.perform_async(fb_id)
			end

			def self.handle_facebook_books fb_id, user_id
				FacebookBooksWorker.perform_async({"fb_id" => fb_id}, user_id, FacebookBooksWorker::WorkStartTheProcess)
			end

			def self.handle_access_tokens params
				User::FacebookUser.new(params).set_access_token_when_expired
			end

			def self.map params
				FacebookBooksHelper.map_book_data(params)
			end
		end
	end
end