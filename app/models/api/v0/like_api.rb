module Api
	module V0
		class LikeApi

			def self.add_facebook_likes params, user_id
				if params[:data].present?
					clause = User.new(user_id).match + User.return_group("user.facebook_likes_retrieval_time AS time")
					facebook_books_retrieval_time = clause.execute[0]['time'] rescue ""
					time_to_add_likes = !facebook_books_retrieval_time.present? || facebook_books_retrieval_time.to_i < (Time.now.to_i - 3600*24*30)
					if time_to_add_likes
						FacebookLikesWorker.perform_async(params, user_id)
					end
				end
			end

			def self.set_info params
				FacebookLikesBookWorker.perform_async(params)
			end

			def self.get_likes user_id
				@user = User.new(user_id)
				info = @user.get_facebook_likes
				info
			end

		end
	end
end