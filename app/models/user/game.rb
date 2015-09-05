class User::Game < User

	def initialize user_id
		@user_id = user_id
		@user = User.new @user_id
	end

	def get_score
		@user.match + User::Game.return_group()
	end

	def self.match
		
	end

	def save_score
		
	end


end