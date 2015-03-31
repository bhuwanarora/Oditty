class Status::StatusType < Status
	def initialize book_id, user_id
		@user_id = user_id
		@book_id = book_id
	end

	def create reading_status
		Status::Mention::Book.new(@book_id, @user_id).create + " SET status  :" + reading_status + " "   
	end

	def create_for reading_status_value 
		clause = ""
		unless reading_status_value.nil?
			case reading_status_value
			when Constants::PlanningToReadStatusCode
				clause = Status::StatusType::PlanningToRead.new(@book_id, @user_id).create
			when Constants::CurrentlyReadingStatusCode
				clause = Status::StatusType::CurrentlyReading.new(@book_id, @user_id).create
			when Constants::ReadStatusCode
				clause = Status::StatusType::Read.new(@book_id, @user_id).create
			end
		end 
		clause
	end
end