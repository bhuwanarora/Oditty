class Status::Mention::MentionsAuthor < Status::Mention
	def initialize mentioned_author_id
		@mentioned_author = User.new(mentioned_author_id)
	end

	def create user_id
		@mentioned_author.match("mentioned_author") + super(user_id, "mentioned_author")
	end
end