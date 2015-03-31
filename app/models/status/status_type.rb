class Status::StatusType < Status
	def initialize user_id, book_id
		@user_id = user_id
		@user = User.new(user_id)
		@book = Book.new(book_id)
		@node_variable = "book"
	end

	def create reading_status 
		@book.match + " , status" + Status::Mention.new(@user_id).create(@node_variable) + " SET status  :" + reading_status + " "   
	end

	def get_reading_status_clause reading_status_value 
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