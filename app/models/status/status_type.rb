class Status::StatusType < Status
	def initialize user_id, book_id, reading_status_value 
		@user_id = user_id
		@user = User.new(user_id)
		@book = Book.new(book_id)
		@reading_status_value = reading_status_value 
		@node_variable = "book"
	end

	def create 
		@book.match + " , status" + Status::Mention.new(@user_id).create(@node_variable) + " SET status  :" + @reading_status_value + " "   
	end
end