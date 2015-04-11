class User::Authenticate::SignUp < Authenticate
	def self.action
		authenticate = false
		user = (User::Info.get_sign_in_credential_by_email.execute)[0]
		verification_token = SecureRandom.hex
		link = Rails.application.config.home+'verify?p='+verification_token.to_s+"&e="+email
		invitation = {:email => email, :template => Constants::EmailTemplate::EmailVerification, :link => link}
		if user.present?
			if user["data"]["verified"]
				message = Constants::EmailAlreadyRegistered
			else
				User::Info.set_verification_token(email, verification_token).execute
				SubscriptionMailer.verify_email(invitation).deliver
				message = Constants::AnotherActivationRequest
			end
		else
			UsersGraphHelper.create_user(email, params[:password], verification_token)
			SubscriptionMailer.verify_email(invitation).deliver
			message = Constants::ActivateAccount
		end
		{:authenticate => authenticate, :message => message }
	end
end