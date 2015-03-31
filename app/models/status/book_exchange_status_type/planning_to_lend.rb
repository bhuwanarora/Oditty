class Status::BookExchangeStatusType::PlanningToLend < Status::BookExchangeStatusType
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
		@exchange_status = "PlanningToLend"
	end

	def create
		Status::BookExchangeStatusType.new(@book_id, @user_id).create(@exchange_status)
	end
end