module FacebookLikesHelper
	def self.add_facebook_likes(params, user_id)
		data = params["data"]
		for like in data
			app_id = params["app_id"]
			category = params["category"]
			created_time = params["created_time"].to_time.to_i
			name = params["name"]
			@facebook_like = FacebookLike.new(app_id)
			@facebook_like.merge_info(category, created_time, name).execute

			@user = User.new(user_id)
			clause = @user.match + @facebook_like.match + ", user " + @user.create_like(created_time)
			clause.execute
		end
	end
end