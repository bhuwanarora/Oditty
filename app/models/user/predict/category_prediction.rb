class User::Predict::CategoryPrediction < User::Predict

	def initialize user_id
		@user_id = user_id
		@user = User.new(user_id)
	end

	def get_favourites
		if @user_id
			@user.match + User.match_root_category + User::Predict::CategoryPrediction.return_init + ::Category::Root.basic_info + ::Category.likes_weight + ::Category.order_desc
		else
			Category::Root.match + Category::Root.return_group(Category::Root.basic_info)
		end
	end

end