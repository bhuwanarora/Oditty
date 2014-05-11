class FileParserWorker
	include FileParser
	@queue = :file_parser
	def self.perform(line, lineNumber)
		puts "parse #{lineNumber}"
		FileParser.parse(line, lineNumber)
	end
end