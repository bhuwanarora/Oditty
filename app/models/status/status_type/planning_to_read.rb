class Status::StatusType::PlanningToRead < Status::StatusType
	def self.create book_id, user_id
		super("PlanningToRead", book_id, user_id)
	end
end