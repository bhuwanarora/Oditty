class Era < Neo
	def initialize id
		@id = id
	end

	def get_books
		" MATCH (book)-[published_in:Published_in]-(year:Year)-[from_era:FromEra]->(era:Era) WHERE ID(era) = " + @id.to_s + " " 
	end

	def self.most_popular user_id
		User.new(user_id).match + Bookmark::Node::BookLabel.match_path + ", (book)-[published_in:Published_in]-(year:Year)-[from_era:FromEra]->(era:Era) WITH user, era, COUNT(book) AS book_count, book ORDER BY book_count DESC LIMIT 1 "
	end

	def self.match_path
		" MATCH (book)-[published_in:Published_in]-(year:Year)-[from_era:FromEra]->(era:Era) "
	end

	def self.basic_info
		" era.name AS era_name, ID(era) AS era_id "
	end

	def self.match_path
		" MATCH (era:`Era`)<-[:FromEra]-(:Year)<-[:Published_in]-(book) "
	end
end