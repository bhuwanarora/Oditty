class User::Authenticate::SignUp < User::Authenticate
	
	def initialize params
		@params = params
		@verification_token = SecureRandom.hex
	end

	def action
		authenticate = false
		user = (User.get_sign_in_credential_by_email(@params[:email]).execute)[0]
		link = Rails.application.config.home+'verify?p='+@verification_token.to_s+"&e="+@params[:email]
		invitation = {:email => @params[:email], :template => Constant::EmailTemplate::EmailVerification, :link => link}
		if user.present?
			if user["verified"]
				message = Constant::StatusMessage::EmailAlreadyRegistered
			else
				info = User.handle_new_verification_request(@params[:email], @verification_token).execute[0]
				params = {:type => "User", :response => info["id"]}
				IndexerWorker.perform_async(params)
				SubscriptionMailer.verify_email(invitation).deliver
				message = Constant::StatusMessage::AnotherActivationRequest
			end
		else
			info = User.handle_new(@params[:email], @params[:password], @verification_token).execute[0]
			params = {:type => "User", :response => info["id"]}
			IndexerWorker.perform_async(params)
			SubscriptionMailer.verify_email(invitation).deliver
			message = Constant::StatusMessage::ActivateAccount
		end
		output   = {:profile_status => 0, :user_id => info["id"], :login_count => info['login_count']}
		puts message
		{:info => output, :authenticate => authenticate, :message => message}
	end
end