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
		info = {:authenticate => authenticate, :message => message, :user => user}
		info
	end
end