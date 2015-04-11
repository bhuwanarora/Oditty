class User::Authenticate < User
	def initialize user_id, params
		@
	end

	def self.action(session, params)
		if params[:old_user]
			info = User::Authenticate::SignIn.action(session, params)
		else
			info = User::Authenticate::SignUp.action(params)
		end
		puts "SESSION USER ID "+session[:user_id].to_s.blue.on_red
		info
	end

end