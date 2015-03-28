class Status::StatusType::CurrentlyReading < Status::StatusType
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
		@status = "CurrentlyReading"
	end
	def create 
		Status::StatusType.new(@book_id, @user_id, @status).create
	end
end