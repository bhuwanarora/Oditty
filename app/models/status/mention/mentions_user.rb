class Status::Mention::MentionsUser < Status::Mention
	def self.create user_id, mentioned_user_id
		super
	end
end