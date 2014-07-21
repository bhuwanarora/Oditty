module BooksHelper
	require 'openlibrary'

	def self.save_ol_dump(details, line_number)
		begin
			details 				= JSON.parse(details) 				rescue nil
			if details.present?
				title 					= details["title"].to_s  					rescue nil
				@book = Book.find_or_create_by(title: title.downcase)
				unless @book.flag
					authors 				= details["authors"]	  					rescue nil
					contributions 			= details["contributions"].to_s  			rescue nil
					covers 					= details["covers"].to_s  					rescue nil #TODO
					description 			= details["description"].to_s 				rescue nil
					edition_name 			= details["edition_name"].to_s  			rescue nil
					genres 					= details["genres"].to_s  					rescue nil
					identifiers 			= details["identifiers"].to_json  			rescue nil
					isbn_10 				= details["isbn_10"].to_s  					rescue nil #TODO
					isbn_13 				= details["isbn_13"].to_s  					rescue nil #TODO
					language 				= details["languages"].to_s  				rescue nil
					lccn 					= details["lccn"].to_s  					rescue nil #TODO
					ocaid 					= details["ocaid"].to_s  					rescue nil #TODO 
					oclc 					= details["oclc"].to_s  					rescue nil #TODO
					oclc_numbers 			= details["oclc_numbers"].to_s  			rescue nil #TODO
					other_titles 			= details["other_titles"] 					rescue nil #TODO
					series 					= details["series"].to_s  					rescue nil
					notes 					= details["notes"].to_s 					rescue nil
					subject_place 			= details["subject_place"].to_s  			rescue nil #TODO
					pages 					= details["number_of_pages"].to_s  			rescue nil
					physical_dimensions		= details["physical_dimensions"].to_s  		rescue nil
					physical_format 		= details["physical_format"].to_s  			rescue nil
					subjects 				= details["subjects"]	 					rescue nil
					subtitles 				= details["subtitles"].to_s  				rescue nil
					table_of_contents 		= details["table_of_contents"].to_s 		rescue nil
					title_prefix 			= details["title_prefix"].to_s  			rescue nil
					type 					= details["type"].to_s 						rescue nil
					url 					= details["url"].to_s  						rescue nil
					weight 					= details["weight"].to_s  					rescue nil
					works 					= details["works"].to_s 					rescue nil #TODO
					work_titles 			= details["work_titles"].to_s  				rescue nil

					if series.present?
						series = BookSeries.where(:name => series[0])
						book_series_id = BookSeries.find_or_create_by(:name => series[0]).id
					end

					if subjects && !subjects.empty?
						subjects.each do |subject|
							if subject
								subject.split(" -- ").each do |sub|
									tag = Tag.find_or_create_by(name: sub.downcase)
									book_tag = BooksTags.find_or_create_by(:book_id => @book.id, :tag_id => tag.id)
								end
							end
						end
					end

					if authors
						olid = authors[0]["key"].split("/authors/")[1] rescue nil
						if olid
							author = Author.find_or_create_by(:olid => olid)
							AuthorsBooks.find_or_create_by(:book_id => @book.id, :author_id => author.id)
						end
					end

					unless genres.blank?
						genres = JSON.parse genres
						genres.each do |genre_name|
							genre = Genre.find_or_create_by(:name => genre_name)
							BooksGenres.find_or_create_by(:book_id => @book.id, :genre_id => genre.id)
						end
					end

					unless covers.blank?
						cover = Book::Cover.find_or_create_by(:book_id => @book.id, :other_info => covers)
					end

					unless identifiers == "null"
						identifiers = JSON.parse(identifiers)
						goodreads = identifiers["goodreads"][0] rescue nil
					end

					unless subject_place.blank?
						subject_places = JSON.parse(subject_place)
						subject_places.each do |place|
							book_subject_place = Book::SubjectPlace.find_or_create_by(:name => place)
							BookSubjectPlacesBooks.find_or_create_by(:book_id => @book.id, :subject_place_id => book_subject_place.id)
						end
					end
					unless isbn_10.blank?
						@book_identifier = Book::Identifier.find_or_create_by(:isbn_10 => isbn_10)
						@book_identifier.update_attributes(:lccn => lccn,
															:oclc => oclc,
															:ocaid => ocaid,
															:oclc_numbers => oclc_numbers,
															:isbn_13 => isbn_13,
															:goodreads => goodreads,
															:book_id => @book.id)
					end
					# authors, genres
					puts "updating #{@book.title}"
					@book.update_attributes(:table_of_contents 		=> table_of_contents,
											:book_series_id 		=> book_series_id,
											:contributions 			=> contributions,
											:edition_name 			=> edition_name,
											:title 					=> title,
											:book_type 				=> type,
											:notes 					=> notes,
											:pages 					=> pages,
											:subtitle 				=> subtitles,
											:title_prefix 			=> title_prefix,
											:physical_format 		=> physical_format,
											:weight 				=> weight,
											:physical_dimensions 	=> physical_dimensions,
											:description 			=> description,
											:url 					=> url,
											:work_titles 			=> work_titles,
											:flag					=> true)
					handle_parse_state(line_number)
				end
			end
		rescue => err
			debugger
			ELogger.log_info "DEBUG: Error in adding a book #{err}"
		end
	end

	def self.initialize_data
		@data ||= Openlibrary::Data
	end

	def self.initialize_client
		@client ||= Openlibrary::Client.new
	end

	def self.reupdate_books
		Book::Identifier.select("isbn_10").each do |isbn_10_obj|
			isbn_10_obj = JSON.parse isbn_10_obj.isbn_10
			isbn_10_obj.each do |isbn_10|
				Resque.enqueue(ReupdateBooksWorker, isbn_10)
				# update_book isbn_10
			end
		end
	end

	def self.update_book isbn_number
		initialize_data
		if Book.book_exists? isbn_number
			book_id = Book.get_book_id_by_isbn isbn_number
			puts "BOOK ID #{book_id} #{isbn_number}"
			if book_id
				@book = Book.find(book_id)
				initialize_data
				book_details = @data.find_by_isbn isbn_number
				if book_details
					if @book.update_attributes(:title => book_details.title, :link => book_details.url, :subtitle => book_details.subtitle,
						:pages => book_details.pages, :weight => book_details.weight)
						if book_details.subjects
							@tags = Tag.create_tags book_details.subjects 
							@book.tags = @tags
						end
						if book_details.subject_places
							@subject_places = Book::SubjectPlace.create_subject_places book_details.subject_places 
							@book.subject_places = @subject_places
						end
						if book_details.subject_people
							@subject_people = Book::SubjectPeople.create_subject_people book_details.subject_people 
							@book.subject_peoples = @subject_people
						end
						if book_details.subject_times
							@subject_times = Book::SubjectTime.create_subject_times book_details.subject_times
							@book.subject_times = @subject_times
						end
						if book_details.identifiers
							@identifier = Book::Identifier.create_identifier book_details.identifiers 
							@book.identifier = @identifier
						end
						if book_details.authors
							@authors = Author.create_authors book_details.authors
							@book.authors = @authors
						end
						if book_details.publishers
							@publishers = Publisher.create_publishers book_details.publishers
						end
						@publishing_details = Book::PublishingDetails.create_publishing_detail(book_details.publish_places, book_details.publish_date, @publishers)

						if book_details.cover
							@cover = Book::Cover.create(book_details.cover)
							@book.covers = [@cover]
						end
						if @publishing_details.present?
							@book.publishing_details = @publishing_details
						end
						@book.save
					end
				end
			end
		end
	end


	def self.find_by_isbn isbn_number
		if Book.book_exists? isbn_number
			initialize_data
			book_details = @data.find_by_isbn isbn_number
			if book_details
				@book = Book.new(:title => book_details.title, :link => book_details.url, :subtitle => book_details.subtitle,
					:pages => book_details.pages, :weight => book_details.weight)
				if @book.save
					if book_details.subjects
						@tags = Tag.create_tags book_details.subjects 
						@book.tags = @tags
					end
					if book_details.subject_places
						@subject_places = Book::SubjectPlace.create_subject_places book_details.subject_places 
						@book.subject_places = @subject_places
					end
					if book_details.subject_people
						@subject_people = Book::SubjectPeople.create_subject_people book_details.subject_people 
						@book.subject_peoples = @subject_people
					end
					if book_details.subject_times
						@subject_times = Book::SubjectTime.create_subject_times book_details.subject_times
						@book.subject_times = @subject_times
					end
					if book_details.identifiers
						@identifier = Book::Identifier.create_identifier book_details.identifiers 
						@book.identifier = @identifier
					end
					if book_details.authors
						@authors = Author.create_authors book_details.authors
						@book.authors = @authors
					end
					if book_details.publishers
						@publishers = Publisher.create_publishers book_details.publishers
					end
					@publishing_details = Book::PublishingDetails.create_publishing_detail(book_details.publish_places, book_details.publish_date, @publishers)

					if book_details.cover
						@cover = Book::Cover.create(book_details.cover)
						@book.covers = [@cover]
					end
					if @publishing_details.present?
						@book.publishing_details = @publishing_details
					end
					@book.save
				end
			end
		end
		#TODO: classifications, links, ebooks
	end

	private
	def self.handle_parse_state(line_number)
		FileParserState.where(:line_number => line_number).first.update_column(:status, true)
	end
end
