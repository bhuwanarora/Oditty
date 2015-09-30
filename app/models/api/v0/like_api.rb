module Api
	module V0
		class LikeApi
			def self.get_likes user_id
				@user = User.new(user_id)
				info = @user.get_facebook_likes.execute
			end

		end
	end
end