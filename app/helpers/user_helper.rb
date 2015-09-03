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
		clause = User.match + User.daily_decrement_wait_list
		clause.execute
	end

end