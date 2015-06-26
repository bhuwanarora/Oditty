module FacebookBooksHelper
	def self.handle_books params, user_id
		facebook_app_id = Constant::Id::FacebookAppId
		goodreads_app_id = Constant::Id::GoodreadsAppId

		books = params["data"]
		if books.present? 
			for data in books
				book = data["data"]["book"] 
				begin
					if data["application"]["id"] == facebook_app_id
						book_id = FacebookBooksHelper.handle_facebook_book(data, user_id) 
						FacebookBooksHelper.set_bookmark("book.from_facebok", user_id, book_id, data["publish_time"])
						FacebookBooksHelper.set_bookmark(data["type"], user_id, book_id, data["publish_time"])
					elsif data["application"]["id"] == goodreads_app_id
						book_id = FacebookBooksHelper.handle_gr_book(data, user_id)
						FacebookBooksHelper.set_bookmark(data["type"], user_id, book_id, data["publish_time"])
					else 
						
					end
				rescue Exception => e
					puts "ERROR   #{e}    FOR     #{book.to_s}".red
				end
			end
		end
	end

	def self.handle_gr_book data, user_id
		book = data["data"]["book"] 
		goodreads_id = book["id"]
		goodreads_title = book["title"]
		goodreads_url = book["url"]

		progress = data["data"]["progress"]
		reading_journey_info = (GoodreadsBook.merge_by_ur(url) + ReadingJourney.link_reading_journey(user_id) + ReadingJourney.set_publish_time(Time.parse(data["publish_time"]).to_i) + ReadingJourney.set_start_time(Time.parse(data["start_time"]).to_i) + Book.return_group("COALESCE(recent_status.timestamp,0) AS timestamp, ID(reading_journey) AS id , ID(book) AS book_id")).execute[0]
		book_id = reading_journey_info['book_id']
		progress_link = ReadingJourney.create_progress(reading_journey_info, progress)
		if progress_link.present?
			progress_link.execute
		end
		book_id
	end

	def self.handle_facebook_book data, user_id
		book = data["data"]["book"] 
		facebook_id = book["id"]
		(FacebookBook.new(facebook_id).merge(book) + ReadingJourney.link_reading_journey(user_id) + ReadingJourney.set_publish_time(Time.parse(data["publish_time"]).to_i) + ReadingJourney.set_start_time(Time.parse(data["start_time"]).to_i) + Book.return_group(Book.basic_info)).execute[0]['book_id'] 
	end

	def self.set_bookmark type, user_id, book_id, publish_time
		case type 
		when "books.wants_to_read"
			bookmark_clause = FacebookBooksHelper.handle_wants_to_reads(user_id, book_id, publish_time)
		when "books.reads"
			bookmark_clause = FacebookBooksHelper.handle_read(user_id, book_id, publish_time)
		when "book.from_facebok"
			bookmark_clause = FacebookBooksHelper.handle_from_facebook(user_id, book_id, publish_time)
		end
	end

	def self.handle_wants_to_reads user_id, book_id, publish_time
		(Bookmark::Type::IntendingToRead.new(user_id, book_id).facebook_book.add.gsub("RETURN", "SET bookmark_node.timestamp = " + Time.parse(publish_time).to_i.to_s + " RETURN ")).execute
	end

	def self.handle_from_facebook user_id, book_id, publish_time
		(Bookmark::Type::FromFacebook.new(user_id, book_id).facebook_book.add.gsub("RETURN", "SET bookmark_node.timestamp = " + Time.parse(publish_time).to_i.to_s + " RETURN ")).execute
	end

	def self.handle_read user_id, book_id, publish_time
		(Bookmark::Type::Read.new(user_id, book_id).facebook_book.add.gsub("RETURN", "SET bookmark_node.timestamp = " + Time.parse(publish_time).to_i.to_s + " RETURN ")).execute
	end

	def self.handle_progress_in_reading_journey
		# ReadingJourney.create_progress
	end
end