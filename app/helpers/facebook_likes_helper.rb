module FacebookLikesHelper
	def self.add_facebook_likes(params, user_id)
		data = params["data"]
		for like in data
			app_id = like["id"]
			category = like["category"]
			created_time = like["created_time"].to_time.to_i
			name = like["name"]
			@facebook_like = FacebookLike.new(app_id)
			@facebook_like.merge_info(category, created_time, name).execute
			@user = User.new(user_id)
			clause = @user.match + @facebook_like.match + ", user " + @user.create_like(created_time) + " RETURN ID(user)"
			clause.execute
		end
	end
end