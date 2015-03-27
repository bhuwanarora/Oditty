class Status::BookExchangeStatusType::PlanningToBuy < Status::BookExchangeStatusType
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
	end

	def create
		super("PlanningToBuy", @book_id, @user_id)
	end
end