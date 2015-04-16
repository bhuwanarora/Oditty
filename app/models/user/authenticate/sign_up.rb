class User::Authenticate::SignUp < User::Authenticate
	
	def initialize params
		@params = params
		@verification_token = SecureRandom.hex
	end

	def action
		authenticate = false
		user = (User.get_sign_in_credential_by_email(@params[:email]).execute)[0]
		link = Rails.application.config.home+'verify?p='+@verification_token.to_s+"&e="+@params[:email]
		invitation = {:email => @params[:email], :template => Constants::EmailTemplate::EmailVerification, :link => link}
		if user.present?
			if user["verified"]
				message = Constants::EmailAlreadyRegistered
			else
				User::Info.set_verification_token(@params[:email], @verification_token).execute
				SubscriptionMailer.verify_email(invitation).deliver
				message = Constants::AnotherActivationRequest
			end
		else
			User.handle_new(@params[:email], @params[:password], @verification_token).execute
			SubscriptionMailer.verify_email(invitation).deliver
			message = Constants::ActivateAccount

			
		end
		{:authenticate => authenticate, :message => message }
	end
end