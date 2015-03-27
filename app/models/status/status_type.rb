class Status::StatusType < Status
	def self.create reading_status_value
		" SET status.status_type = \"" + reading_status_value + "\" "   
	end
end