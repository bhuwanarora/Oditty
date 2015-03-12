module SignupBookFinderHelper
	def find_books_on_count user_id
		begin
			limit = 30
			count_match_clause = " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " RETURN user.total_count"
			range = ((neo.execute_query count_match_clause)["data"]).flatten.to_s
			count = count.to_i
			general_clause = " OPTIONAL MATCH (user:User)--(:MarkAsReadNode)--(book:Book) WHERE ID(user) = " + user_id.to_s + 
			if range == ["0-20"] 
				user_case_clause = " RETURN ID(book)"
				clause = general_clause + user_case_clause
				book_ids = (neo.execute_query clause)["data"].flatten
				if book_ids.blank?
					get_ten_small_books_clause = " MATCH small_read_path = (small_read:Book)-[:NextSmallRead*10] WHERE ID(small_read) = " + Constants::MostPopularSmallReadID + "  RETURN EXTRACT(n in nodes(small_read_path)|ID(n)) AS book_ids "
					clause = general_clause + get_ten_small_books_clause
					book_ids = (neo.execute_query clause)["book_ids"].flatten
				end
			else ["20-50", "50-100", "100-250"].include? range
			 	match_book_genre_clause = "  WITH user, book MATCH book-[:FromCategory]->()-[HasRoot*0..1]->(root_category{is_root:true}) WITH book, root_category ORDER BY book.total_weight DESC LIMIT " + limit.to_s + " RETURN root_category.name, COLLECT(DISTINCT(book.title)) AS books, COUNT(book) AS book_count ORDER BY book_count DESC "
			 	clause =  general_clause + match_book_genre_clause
			 	books_and_genres = (neo.execute_query clause)["data"] 
			 	if books_and_genres.blank?
			 		find_genre_books = " WITH USER MATCH (user:User)-[:LikesGenre]-(category:Category)-[:HasRoot*0..1]-(root_category) WITH root_category, TOINT(30/COUNT(DISTINCT(root_category))) AS depth MATCH path = (root_category)-[:NextInGenre*depth]-(popular_book) RETURN root_category, (n IN nodes(path)| book) AS book RETURN root_category, book"
			 		clause = general_clause + find_genre_books
			 		books_and_genres = ((neo.execute_query clause)["data"])
			 	end
			end
		rescue Exception => e
			output = e.to_s
			status = 500
	end
end