module Api
	module V0
		class LikeApi
			def self.add_facebook_likes params, user_id
				# if params["data"].present?
				# 	clause = User.new(user_id).match + User.return_group("user.facebook_likes_retrieval_time AS time")
				# 	facebook_books_retrieval_time = clause.execute[0]['time'] rescue ""
				# 	time_to_add_likes = !facebook_books_retrieval_time.present? || facebook_books_retrieval_time.to_i < (Time.now.to_i - 3600*24*30)
				# 	# if time_to_add_likes
				# 	# 	FacebookLikesWorker.perform_async(params, user_id)
				# 	# end
				# end
			end

			def self.set_info params
				# params_worker  = params.clone
				# unwanted_keys = ['controller','action']
				# unwanted_keys.each{|key| params_worker.delete(key)}
				# params_worker = {"data" => params_worker}
				# FacebookLikesBooksWorker.perform_async(params_worker)
			end

			def self.get_likes user_id
				# @user = User.new(user_id)
				# info = @user.get_facebook_likes.execute
			end

		end
	end
end