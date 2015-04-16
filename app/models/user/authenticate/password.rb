class User::Authenticate::Password < User::Authenticate
	
	def initialize email 
		@email = email
	end

	def recover 
		user = (User.get_by_email(@email).execute)[0]
		user_exists = user.present?
		if user_exists
			verification_token = SecureRandom.hex
			link = Rails.application.config.home+'recover_password?p='+verification_token.to_s+"&e="+@email
			invitation = {:email => @email, :template => Constants::EmailTemplate::PasswordReset, :link => link}
			SubscriptionMailer.recover_password(invitation).deliver
			User::Info.set_verification_token(@email, verification_token).execute
		end
		user_exists
	end
end