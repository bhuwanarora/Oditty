module FileParser
	include BooksHelper

	BookKeys = ["table_of_contents", "series", "lc_classifications", "contributions", "edition_name", "title", "languages", "subjects", "publish_country", "by_statement", "type", "revision", "publishers", "last_modified", "key", "publish_places", "pagination", "dewey_decimal_class", "notes", "number_of_pages", "lccn", "isbn_10", "publish_date", "authors", "oclc_number", "subtitle", "genres", "title_prefix", "physical_format", "weight", "isbn_13", "covers", "latest_revision", "physical_dimensions", "identifiers", "subject_place", "source_records", "created", "works", "other_titles", "description", "url", "work_titles", "ocaid", "oclc_numbers"]

	AuthorKeys = ["last_modified", "type", "name", "key", "revision", "personal_name", "death_date", "birth_date", "title"]

	Subjects = []
	CollectionKeys = []
	PublishDate = []

	def self.open_file path="/Volumes/SAMSUNG/ol_cdump_2013-10-31.txt/ol_cdump_2013-10-31.txt"
		lineNumber = 0
		details = []
		File.open(path).each_line do |line|
			puts "lineNumber #{lineNumber}"
			parse_status = FileParserState.find_or_create_by(:line_number => lineNumber)
			unless parse_status.data_flag
				parse_status.update_attributes(:data => line, :data_flag => true)
			end
			unless parse_status && parse_status.status
				if lineNumber < 1232372
				else
					Resque.enqueue(FileParserWorker, line, lineNumber)
				end
				lineNumber = lineNumber + 1
			else
				lineNumber = lineNumber + 1
			end
		end
	end

	def self.count_line path="/Volumes/SAMSUNG/ol_cdump_2013-10-31.txt/ol_cdump_2013-10-31.txt"
		lineNumber = 0
		File.open(path).each_line do |line|
			puts "lineNumber #{lineNumber}"
			lineNumber = lineNumber + 1
		end
	end

	def self.file_parser path="/Volumes/SAMSUNG/ol_cdump_2013-10-31.txt/ol_cdump_2013-10-31.txt"
		lineNumber = 0
		File.open(path).each_line do |line|
			puts "lineNumber #{lineNumber}"
			parse_status = FileParserState.find_or_create_by(:line_number => lineNumber)
			unless parse_status.data_flag
				parse_status.update_attributes(:data => line, :data_flag => true)
			end
			lineNumber = lineNumber + 1
		end

	end

	def self.parse_goodreads_genre path="/Volumes/SAMSUNG/test_project/genre_list.txt"
		File.open(path).each_line do |line|
			line = JSON.parse line
			line.sort!
			line.map{|s| GoodReadsGenre.create(:name => s)}
		end
	end

	def self.good_reads_genres_tags
		tags = Tag.pluck(:name)
		GoodReadsGenre.all.each do |genre|
			mapped_tags = tags.grep genre.name
			if mapped_tags.present?
				puts "Mapped tag found for #{genre.name}"
				mapped_tags.each do |tag|
					tag = Tag.find_by(:name =>  tag)
					if tag
						GoodReadsGenresTags.find_or_create_by(:good_reads_genre_id => genre.id, :tag_id => tag.id)
					else
						puts "Error in finding tag. #{genre.name}"
					end
				end
			else
				puts "Mapped tag NOT found for #{genre.name}"
			end
		end
	end

	def self.parse(line, lineNumber)
		puts "#{lineNumber}"
		if line.include?"\t"
			fields = line.split("\t")
			is_author = fields[0] == "/type/author"
			is_book = fields[0] == "/type/edition"
			is_collection = fields[0] == "/type/collection"

			details = fields[4]
			if is_author
				handle_parse_type(lineNumber, "AUTHOR")
			elsif is_book
				handle_parse_type(lineNumber, "BOOK")
				save_books_to_database(details, lineNumber)
			elsif is_collection
				handle_parse_type(lineNumber, "COLLECTION")
			else
				handle_parse_type(lineNumber, "UNKNOWN")
			end
		end
	end

	private
		def self.handle_parse_type(lineNumber, type)
			parse_state = FileParserState.where(:line_number => lineNumber).first
			if parse_state
				parse_state.update_column(:object_type, type)
			else
				FileParserState.create(:line_number => lineNumber, :object_type => type)
			end
		end

		def self.save_books_to_database(details, lineNumber)
			BooksHelper.save_ol_dump(details, lineNumber)
		end

		def self.handle_collection
			details = JSON.parse details
			if details
				details.keys.each do |key|
					unless CollectionKeys.include? key
						CollectionKeys.push key 
						ELogger.log_info("-------------------------COLLECTION #{details['name']}")
					end
				end
			end
		end

		def self.log_books details
			# details = JSON.parse details
			# ELogger.log_info("-by_statement-"+details["by_statement"]) 					if details["by_statement"]
			# ELogger.log_info("-notes-"+details["notes"].to_s) 								if details["notes"]
			# ELogger.log_info("-pagination-"+details["pagination"]) 						if details["pagination"]
			# ELogger.log_info(details["dewey_decimal_class"]) 	if details["dewey_decimal_class"]
			# ELogger.log_info(details["source_records"]) 				if details["source_records"]
			# ELogger.log_info(details["works"]) 								if details["works"]
			# ELogger.log_info(details["description"]) 					if details["description"]
			# ELogger.log_info(details["work_titles"]) 					if details["work_titles"]
			PublishDate.push details["publish_date"]									if details["publish_date"]
		end

		def self.handle_subjects details
			details = JSON.parse details
			subjects = details["subjects"]
			if subjects && !subjects.empty?
				puts subjects
				subjects.each do |subject|
					if subject
						subject.split(" -- ").each do |sub|
							Subjects.push sub unless Subjects.include?(sub)
						end
					end
				end
			end
		end

		def self.handle_author details
			details = JSON.parse details
			# puts details.keys
			details.keys.each do |key|
				AuthorKeys.push key unless AuthorKeys.include?(key)
			end
			puts "-------------------------AUTHOR #{details['name']}"
			ELogger.log_info("-------------------------AUTHOR #{details['name']}")
		end

		def self.handle_book details
			details = JSON.parse details
			# puts details.keys
			details.keys.each do |key|
				BookKeys.push key unless BookKeys.include?(key)
			end
			puts "-----------------------------BOOK #{details['title']}"
			ELogger.log_info("-----------------------------BOOK #{details['title']}")
		end
end