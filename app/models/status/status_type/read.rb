class Status::StatusType::Read < Status::StatusType
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
		@status = "Read"
	end

	def create 
		Status::StatusType.new(@book_id, @user_id).create(@status)
	end
end