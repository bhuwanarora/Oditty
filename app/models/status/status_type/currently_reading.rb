class Status::StatusType::CurrentlyReading < Status::StatusType
	def self.create
		super("CurrentlyReading")
	end
end