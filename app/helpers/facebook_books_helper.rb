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
				# Search for a Book, FacebookBook with id == facebook_id
				# if not found then Create a Separate Node with id, title, type, url
				# (:User)-[:HasReadingJourney]->(reading_journey:ReadingJourney)-[:ForBook]->(:FacebookBook)
				# handle_reading_journey + handle_reading_journey

				# FRONTEND: now will fetch more data for these books and will send at the backend
				# /api/v0/map_fb_book POST

				# Remove these nodes, and create new links and also save the information in the Book node, and in the Reading Journey
				# FacebookBook.new().map
			elsif data["application"]["id"] == goodreads_app_id
				progress = data["data"]["progress"]
				# Search for a book with url == gr_url

				# Save the progress with Reading Journey 
				# handle_progress_in_reading_journey

				# (:User)-[:HasReadingJourney]->(reading_journey:ReadingJourney)-[:ForBook]->(:Book)
				# (reading_journey)-[:NextStatus]->(Progress{status, percentage, created_at})
				# created_at == timestamp
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