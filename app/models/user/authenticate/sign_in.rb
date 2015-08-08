class User::Authenticate::SignIn < User::Authenticate
	
	def initialize params 
		@params = params
	end

	def action 
		info = {}
		authenticate = false
		user = (User.get_sign_in_credential_by_email(@params[:email]).execute)[0]
		puts "signin".red
		begin
			user_authenticated = user["password"] == @params[:password] && user["verified"]
			if user_authenticated
				authenticate = true
				clause = User.new(user["id"]).match + User::Info.set_last_login + " RETURN user.login_count "
				output = clause.execute
				info   = {:profile_status => 0, :user_id => user["id"], :login_count => output[0]['login_count']}
				message = Constant::StatusMessage::LoginSuccess
			elsif  user["password"] != @params[:password]
				message = Constant::StatusMessage::AuthenticationFailed
			elsif !user["verified"]
				message = Constant::StatusMessage::VerifyEmail
			else
				message = Constant::StatusMessage::AuthenticationFailed
			end
		rescue => err
			puts err.to_s
			message = Constant::StatusMessage::EmailNotRegistered
		end
		puts message.red
		{:info => info, :authenticate => authenticate, :message => message, :user => user}
	end
end