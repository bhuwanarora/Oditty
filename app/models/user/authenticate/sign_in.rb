class User::Authenticate::SignIn < User::Authenticate
	
	def initialize session, params 
		@session = session
		@params = params
	end

	def action 
		info = {}
		authenticate = false
		user = (User.get_sign_in_credential_by_email(@params[:email]).execute)[0]
		puts "signin".red
		begin
			active_user_authenticated = (user["password"] == @params[:password]) && user["verified"] && (user["active"] == true)
			user_authenticated = user["password"] == @params[:password] && user["verified"]
			if active_user_authenticated
				authenticate = true
				@session[:user_id] = user["id"]
				User::Info.set_last_login.execute(@params[:email])
				info = {:profile_status => 0, :user_id => user["id"]}
				message = Constants::LoginSuccess
			elsif user_authenticated
				message = Constants::PendingActivation
			elsif  user["password"] != @params[:password]
				message = Constants::AuthenticationFailed
			elsif !user["verified"]
				message = Constants::VerifyEmail
			else
				message = Constants::AuthenticationFailed
			end
		rescue => err
			message = Constants::EmailNotRegistered
		end
		{:info => info, :authenticate => authenticate, :message => message }
	end
end