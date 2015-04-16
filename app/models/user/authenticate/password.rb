class User::Authenticate::Password < User::Authenticate
	
	def initialize email 
		@email = email
	end

	def recover verification_token 
		User.handle_new_verification_request(@email, verification_token)
	end
end