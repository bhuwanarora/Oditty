module FacebookBooksHelper
	def self.handle_books params
		facebook_app_id = Constants::Id::FacebookAppId
		goodreads_app_id = Constants::Id::GoodreadsAppId

		books = params["data"]
		for data in books
			publish_time = data["publish_time"]
			start_time = data["start_time"]
			book = data["data"]["book"]
			if data["application"]["id"] == facebook_app_id
				(Book.merge_by_fb_id(data) + UsersBook.link_reading_journey(id) + Book.return_group(Book.basic_info)).execute 
			elsif data["application"]["id"] == goodreads_app_id
				progress = data["data"]["progress"]
				reading_journey_info = (Book.merge_by_gr_url(data) + UsersBook.new(id).link_reading_journey + Book.return_group("COALESCE(recent_status.timestamp,0) AS timestamp, ID(reading_journey) AS id ")).execute[0]
				UsersBook.create_progress(reading_journey_info, progress).execute 
			end
		end
	end

	def self.handle_wants_to_reads
		
	end

	def self.handle_facebook_book params
		facebook_id = params["id"]
		title = params["title"]
		facebook_url = params["url"]
		clause = " MERGE (book) WHERE (book:Book OR book:FacebookBook) AND book.facebook_id = " + facebook_id.to_s + " ON CREATE SET book.facebook_id = " + facebook_id.to_s + " SET book.title = \"" + title.to_s + "\" SET book.facebook_url = \"" + facebook_url + "\" SET book :FacebookBook WITH book "
		clause
	end

	def self.handle_reading_journey
		User.new(user_id).match + User.with_group("user", "book") + ReadingJourney.create
	end

	def self.handle_progress_in_reading_journey
		# ReadingJourney.create_progress
	end
end