class User::Authenticate < User
	def initialize(params)
		@params = params
	end

	def action
		if @params[:old_user]
			info = User::Authenticate::SignIn.new(@params).action
		else
			info = User::Authenticate::SignUp.new(@params).action
		end
		info
	end

	def verify
		User.handle_verification(@params[:e], @params[:p])
	end
end