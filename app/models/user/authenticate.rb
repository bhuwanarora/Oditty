class User::Authenticate < User
	def initialize(session, params)
		@session = session
		@params = params
	end

	def action
		if @params[:old_user]
			info = User::Authenticate::SignIn.new(@session, @params).action
		else
			info = User::Authenticate::SignUp.new(@params).action
		end
		puts "SESSION USER ID "+@session[:user_id].to_s.blue.on_red
		info
	end

	def verify
		User.handle_verification(@params[:e], @params[:p])
	end
end