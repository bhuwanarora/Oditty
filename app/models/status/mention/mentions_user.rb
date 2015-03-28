class Status::Mention::MentionsUser < Status::Mention
	def initialize mentioned_user_id
		@mentioned_user = User.new(mentioned_user_id)
	end

	def create user_id
		@mentioned_user.match("mentioned_user") + super(user_id, "mentioned_user")
	end
end