class Status::BookExchangeStatusType::PlanningToLend < Status::BookExchangeStatusType
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
	end

	def create
		super("PlanningToLend", @book_id, @user_id)
	end
end