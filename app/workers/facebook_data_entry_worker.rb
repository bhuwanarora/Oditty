class FacebookDataEntryWorker
	@queue = :facebook_data
	def self.perform(user_exists, params)
		puts "user_exists #{user_exists}"
		if params["email"].present?
			if user_exists
				clause = User::Authenticate::FacebookAuthentication.new(params).update_user_with_email 
			else
				clause = User::Authenticate::FacebookAuthentication.new(params).create_user_with_email 
			end
		else 
			if user_exists
				clause = User::Authenticate::FacebookAuthentication.new(params).update_user_without_email 
			else
				clause = User::Authenticate::FacebookAuthentication.new(params).create_user_without_email 
			end
		end
		clause.execute
	end
end