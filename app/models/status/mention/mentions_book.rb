class Status::Mention::MentionsBook < Status::Mention
	def initialize book_id, user_id
		@book = Book.new(book_id)
		@user_id = user_id
		@node_variable = "book"
	end

	def create 
		@book.match(@node_variable) + Status::Mention.new(@user_id).create(@node_variable)
	end
end