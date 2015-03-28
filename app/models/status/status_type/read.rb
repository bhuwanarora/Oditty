class Status::StatusType::Read < Status::StatusType
	def self.create book_id, user_id
		super("Read", book_id, user_id)
	end
end