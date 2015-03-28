class Status::BookExchangeStatusType::PlanningToBorrow < Status::BookExchangeStatusType
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
		@exchange_status = "PlanningToBorrow"
	end

	def create
		Status::BookExchangeStatusType.new(@book_id, @user_id, @exchange_status).create
	end
end