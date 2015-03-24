class Era < Neo
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def most_popular
		@user.match + Bookmark.match("book", "Book") + ", (book)-[published_in:Published_in]-(year:Year)-[from_era:FromEra]->(era:Era) WITH user, era, COUNT(book) AS book_count, book ORDER BY book_count DESC LIMIT 1 "
	end

	def self.basic_info
		" era.name AS era_name, ID(era) AS era_id "
	end
end