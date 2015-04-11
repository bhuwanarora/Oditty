class User::Authenticate::SignIn < User::Authenticate
	def self.action session, params
		info = {}
		authenticate = false
		email = params[:email]
		user = (User::Info.get_sign_in_credential_by_email.execute)[0]
		puts "signin".red
		begin
			active_user_authenticated = (user["password"] == params[:password]) && user["verified"] && (user["active"] == true)
			user_authenticated = user["password"] == params[:password] && user["verified"]
			if active_user_authenticated
				authenticate = true
				session[:user_id] = user["id"]
				info = {:profile_status => 0, :user_id => user["id"]}
				message = Constants::LoginSuccess
			elsif user_authenticated
				message = Constants::PendingActivation
			elsif  user["password"] != params[:password]
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

	def self.is_active_user_authenticated
		
	end

end