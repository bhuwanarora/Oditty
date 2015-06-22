class StarGenre < Neo
	def self.match
		" MATCH (star_genre:StarGenre) WITH star_genre "
	end

	def self.search q
		"START star_genre = node:node_auto_index('indexed_star_genre_name:" + q +"*" + "') "
	end

	def self.get_search_results q
		StarGenre.search(q) + StarGenre.return_group(StarGenre.basic_info) + StarGenre.limit(10)
	end

	def self.basic_info
		" star_genre.books_count AS books_count, star_genre.name AS name, ID(star_genre) AS id "
	end

end