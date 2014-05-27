module ELogger
	LOG_DIRECTORY_PATH = Rails.root.join('log')  

	def self.initialize_logger   
		@logger = Logger.new(LOG_DIRECTORY_PATH.join('custom.log'), 'daily')
		original_formatter = Logger::Formatter.new  
		@logger.formatter = proc { |severity, datetime, progname, msg| 
			original_formatter.call(severity, datetime, progname, msg) 
		}
		@logger   
	end

	def self.log_error(message)
		@logger ||= initialize_logger 
		@logger.level = Logger::FATAL
		@logger.error(message) 
	end

	def self.log_info(message)
		@logger ||= initialize_logger 
		@logger.level = Logger::INFO
		@logger.info(message) 
	end
end