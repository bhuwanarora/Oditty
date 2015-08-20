module ELogger
	LOG_DIRECTORY_PATH = Rails.root.join('log')  

	def self.initialize_logger logfile_name = 'custom'
		@logger = Logger.new(LOG_DIRECTORY_PATH.join( logfile_name + '.log'), 'daily')
		original_formatter = Logger::Formatter.new  
		@logger.formatter = proc { |severity, datetime, progname, msg| 
			original_formatter.call(severity, datetime, progname, msg) 
		}
		@logger   
	end

	def self.log_error(message, logfile_name = 'custom')
		@logger ||= initialize_logger logfile_name
		@logger.level = Logger::FATAL
		@logger.error(message) 
	end

	def self.log_info(message, logfile_name = 'custom')
		@logger ||= initialize_logger logfile_name
		@logger.level = Logger::INFO
		@logger.info(message) 
	end
end