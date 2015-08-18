class FacebookDataEntryWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :facebook_user
	def perform(user_exists, params, user_id)
		if params["email"].present?
			puts " email : #{params["email"]}"
			if user_exists && !params[:invited_by_someone]
				puts " user_exists"
				clause = User::Authenticate::FacebookAuthentication.new(params).update_user_with_email user_id 
			elsif params[:invited_by_someone]
				puts " User was invited by someone "
				clause = User::InvitedUser.handle_new_from_facebook params
			else
				puts " user does not exists"
				clause = User::Authenticate::FacebookAuthentication.new(params).create_user_with_email user_id 
			end
		else 
			if user_exists
				puts " user_exists"
				clause = User::Authenticate::FacebookAuthentication.new(params).update_user_without_email user_id
			else
				puts " user does not exists"
				clause = User::Authenticate::FacebookAuthentication.new(params).create_user_without_email user_id
			end
		end
		clause.execute
		params = {:type => "User", :response => user_id}
		IndexerWorker.perform_async(params)
	end
end