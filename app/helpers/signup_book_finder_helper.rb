module SignupBookFinderHelper
	def find_books_on_count user_id
		begin
			count_match_clause = " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " RETURN user.total_count"
			range = ((neo.execute_query count_match_clause)["data"]).flatten.to_s
			count = count.to_i
			general_clause = " MATCH (user:User)--(:MarkAsReadNode)--(book:Book) WHERE ID(user) = " + user_id.to_s + 
			if ["0-20"] == range
				user_case_clause = " RETURN ID(book)"
				clause = general_clause + user_case_clause
				book_ids = (neo.execute_query clause)["data"].flatten
				if book_ids.blank?
					get_ten_small_books_clause = " MATCH small_read_path = (small_read:Book)-[:NextSmallRead*10] WHERE ID(small_read) = " + Constants::MostPopularSmallReadID + "  RETURN EXTRACT(n in nodes(small_read_path)|ID(n)) AS book_ids "
					clause = general_clause + get_ten_small_books_clause
					book_ids = (neo.execute_query clause)["book_ids"].flatten
				end
			elsif ["20-50", "50-100", "100-250"].include? range
			 	match_book_genre_clause = " WITH user, book MATCH book-[:FromCategory*0..1]-(root_category{is_root:true}) RETURN root_category, book"


			 	 20..200
				Send all user books grouped by genre and sorted by popularity.
				Not available: Send 30 books grouped by genres selected, sorted 
				user_case_clause = " WITH user MATCH ("
			else
			end
		rescue Exception => e
			output = e.to_s
			status = 500
	end
end