class Status::StatusType < Status
	def self.create reading_status_value, book_id, user_id
		Book.new(book_id).match + " , status" + Status::Mention.new(user_id).create(user_id,"book") + " SET status  :" + reading_status_value + " "   
	end
end