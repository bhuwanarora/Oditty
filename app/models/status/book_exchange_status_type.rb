class Status::BookExchangeStatusType < Status
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
	end
	def create relation
		Book.new(@book_id).match + " MERGE (status)-[mentions_book:" + relation + "{user_id:" + @user_id.to_s + "}]->(book) "
	end

	def get_book_exchange_status_clause book_exchange_status
		unless book_exchange_status.nil?
			case book_exchange_status
			when Constants::PlanningToBuyStatusCode
				clause = Status::BookExchangeStatusType::PlanningToBuy.new(@book_id, @user_id).create
			when Constants::PlanningToLendStatusCode
				clause = Status::BookExchangeStatusType::PlanningToLend.new(@book_id, @user_id).create
			when Constants::PlanningToBorrowStatusCode
				clause = Status::BookExchangeStatusType::PlanningToBorrow.new(@book_id, @user_id).create
			end
		else
			clause = ""
		end
		clause
	end
end