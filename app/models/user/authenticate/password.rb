class User::Authenticate::Password < User::Authenticate
	
	def initialize email 
		@email = email
	end

	def recover 
		User.get_by_email(@email)
	end
end