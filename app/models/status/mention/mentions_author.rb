class Status::Mention::MentionsAuthor < Status::Mention
	def initialize author_id
		@author = Author.new(author_id)
	end

	def create user_id
		@author.match("mentioned_author") + super(user_id, "mentioned_author")
	end
end