class SocialBook < Neo

	def self.basic_info
		" book.id AS goodreads_id, labels(book) AS label, book.facebook_id AS facebook_id, ID(book) AS book, book.title AS title, book.facebook_url AS facebook_url, book.goodreads_url AS goodreads_url "
	end

	def self.match
		" MATCH (user)-[:HasReadingJourney]-(reading_journey:ReadingJourney)-[:ForBook]-(book) WHERE book :FacebookBook OR book :GoodreadsBook WITH book "
	end
end