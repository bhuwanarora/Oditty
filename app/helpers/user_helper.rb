module UserHelper
	
	def self.create_invited_user invitee_id, email
		clause = User.match_by_email(email) + " RETURN ID(user) AS id"
		output = clause.execute
		user_present = output[0]["id"].present? rescue false
		if !user_present
			User::InvitedUser.new(invitee_id).create(email).execute
		end
		user_present
	end

	def self.wait_list_decrement
		clause = User.match + User.daily_decrement_wait_list + User.return_group(User.authentication_info, "user.email AS email")
		neo_output = clause.execute
		debugger
		neo_output.each do |output|
			if output["wait_list_count"].present? && output["wait_list_count"] > 0
				params =
				{
					:waitlist => output["wait_list_count"],
					:email => output["email"]
				}
				SubscriptionMailer.waitlist(params).deliver
			elsif output["wait_list_count"].present? && output["wait_list_count"] == 0
				params =
				{
					:waitlist => output["wait_list_count"],
					:email => output["email"]
				}
				SubscriptionMailer.waitlist_zero(params).deliver
			end
		end
	end

end