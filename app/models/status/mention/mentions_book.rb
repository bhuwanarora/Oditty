class Status::Mention::MentionsBook < Status::Mention
	def initialize mentioned_book_id
		@mentioned_book = Book.new(mentioned_book_id)
	end

	def create user_id
		@mentioned_book.match("mentioned_book") + super(user_id, "mentioned_book")
	end
end