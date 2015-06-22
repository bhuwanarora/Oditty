module FacebookBooksHelper
	def self.handle_books params, user_id
		facebook_app_id = Constant::Id::FacebookAppId
		goodreads_app_id = Constant::Id::GoodreadsAppId

		books = params["data"]
		if books.present? 
			for data in books
				book = data["data"]["book"] 
				if data["application"]["id"] == facebook_app_id
					book_id = FacebookBooksHelper.handle_facebook_book(book, user_id) 
					FacebookBooksHelper.set_bookmark("book.from_facebok", user_id, book_id)
				elsif data["application"]["id"] == goodreads_app_id
					book_id = FacebookBooksHelper.handle_gr_book(data, user_id) 
				end
				FacebookBooksHelper.set_bookmark(data["type"], user_id, book_id)
			end
		end
	end

	def self.handle_gr_book data, user_id
		book = data["data"]["book"] 
		progress = data["data"]["progress"]
		reading_journey_info = (FacebookBook.merge_by_gr_url(book["url"]) + ReadingJourney.link_reading_journey(user_id) + Book.return_group("COALESCE(recent_status.timestamp,0) AS timestamp, ID(reading_journey) AS id , ID(book) AS book_id")).execute[0]
		book_id = reading_journey_info['book_id']
		progress_link = ReadingJourney.create_progress(reading_journey_info, progress)
		if progress_link.present?
			progress_link.execute
		end
		book_id
	end

	def self.handle_facebook_book book, user_id
		facebook_id = book["id"]
		(FacebookBook.new(facebook_id).merge(book) + ReadingJourney.link_reading_journey(user_id) + Book.return_group(Book.basic_info)).execute[0]['book_id'] 
	end

	def self.set_bookmark type, user_id, book_id
		case type 
		when "books.wants_to_read"
			bookmark_clause = FacebookBooksHelper.handle_wants_to_reads(user_id, book_id)
		when "books.reads"
			bookmark_clause = FacebookBooksHelper.handle_read(user_id, book_id)
		when "book.from_facebok"
			bookmark_clause = FacebookBooksHelper.handle_from_facebook(user_id, book_id)
		end
	end

	def self.handle_wants_to_reads user_id, book_id
		Bookmark::Type::IntendingToRead.new(user_id, book_id).facebook_book.add.execute
	end

	def self.handle_from_facebook user_id, book_id
		Bookmark::Type::FromFacebook.new(user_id, book_id).facebook_book.add.execute
	end

	def self.handle_read user_id, book_id
		Bookmark::Type::Read.new(user_id, book_id).facebook_book.add.execute
	end

	def self.handle_progress_in_reading_journey
		# ReadingJourney.create_progress
	end
end