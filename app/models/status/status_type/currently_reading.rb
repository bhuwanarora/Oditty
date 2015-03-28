class Status::StatusType::CurrentlyReading < Status::StatusType
	def self.create book_id, user_id
		super("CurrentlyReading", book_id, user_id)
	end
end