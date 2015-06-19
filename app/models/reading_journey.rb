class ReadingJourney < Neo
	def initialize user_id, book_id
		@user_id = user_id
		@book_id = book_id
		@user = User.new(user_id)
		@book = Book.new(book_id)
	end

	def self.create
		" CREATE UNIQUE (user)-[:HasReadingJourney]->(reading_journey:ReadingJourney)-[:ForBook]->(book) CREATE UNIQUE (reading_journey)-[:NextStatus]->(reading_journey) "
	end

	def self.create_progress

	end

	def self.match_facebook_book
		" MATCH (user)-[:HasReadingJourney]-(reading_journey:ReadingJourney)-[:ForBook]-(book:FacebookBook) "
	end
end