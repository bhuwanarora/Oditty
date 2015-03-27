class Status::Mention::MentionsAuthor < Status::Mention
	def self.create user_id, mentioned_author_id
		super
	end
end