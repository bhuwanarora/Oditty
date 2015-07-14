class Genre < Neo

	def initialize id
		@id = id
	end

	def self.optional_match_books
		" OPTIONAL " + Genre.match_books
	end

	def self.match_books
		" MATCH (genre:Genre)-[:Belongs_to]->(book) WITH genre, book "
	end

	def match_books
		" MATCH (genre)-[:Belongs_to]->(book) WHERE ID(genre)="+@id.to_s+" WITH genre, book "
	end

	def self.basic_info
		" genre.name AS name, genre.books_count AS books_count, ID(genre) AS id "
	end

	def self.grouped_basic_info
		" name: genre.name, books_count: genre.books_count, id: ID(genre) "
	end

	def match
		" MATCH (genre:Genre) WHERE ID(genre)="+@id.to_s+" WITH genre "
	end

	def get_basic_details
		match + Genre.return_group(Genre.basic_info)
	end

end