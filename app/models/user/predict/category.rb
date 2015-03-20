class User::Predict::Category < User::Predict

	def initialize user_id
		@user_id = user_id
		@user = User.new(user_id)
	end

	def get_favourites
		@user.match_clause + User.root_category_clause + return_init + ::Category::Root.get_basic_info + ::Category::Root.order_desc
	end
	
end