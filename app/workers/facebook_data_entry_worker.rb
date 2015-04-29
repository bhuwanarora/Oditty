class FacebookDataEntryWorker
	@queue = :facebook_data
	def self.perform(user_exists, params)
		if params["email"].present?
			if user_exists
				clause = Api::V0::UserApi._update_user_with_email params
			else
				clause = Api::V0::UserApi._create_user_with_email params
			end
		else 
			if user_exists
				clause = Api::V0::UserApi._update_user_without_email params
			else
				clause = Api::V0::UserApi._create_user_without_email params
			end
		end
		clause.execute
	end
end