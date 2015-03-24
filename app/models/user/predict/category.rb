class User::Predict::Category < User::Predict

	def initialize user_id
		@user_id = user_id
		@user = User.new(user_id)
	end

	def get_favourites
		@user.match + User.match_root_category + return_init + ::Category::Root.basic_info + ::Category.likes_weight + ::Category.order_desc
	end
	
end