class Status::StatusType::PlanningToRead < Status::StatusType
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
		@status = "PlanningToRead"
	end

	def create 
		Status::StatusType.new(@book_id, @user_id, @status).create
	end
end