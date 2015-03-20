class User::Predict::Book < User::Predict

	def likely_books_read
		range = self.get_book_count
		@skip_count = @skip_count.to_i > @limit ? @skip_count.to_i : Constants::InitialSkipCount  
		case range
		when Constants::ChildBookCountRange
			data = _handle_few_books_read
		when Constants::AdoloscentBookCountRange
			data = _handle_average_number_books_read
		when Constants::AboutToBeAdultBookCountRange
			data = _handle_average_number_books_read
		when Constants::AdultBookCountRange
			data = _handle_average_number_books_read
		when Constants::AboutToDieBookCountRange
			data = _handle_average_number_books_read
		end
		data
	end

	def _handle_average_number_books_read
	 	need_rating = true
	 	match_book_genre_clause = " MATCH (book)-[:FromCategory]->(:Category)-[HasRoot*0..1]->(root_category{is_root:true}) WITH book, mark_as_read, root_category, rating_node  ORDER BY book.total_weight DESC SKIP " + @skip_count.to_s + " LIMIT " + Constants::BookCountShownOnSignup.to_s + " RETURN root_category.name as name, ID(root_category) as category_id, root_category.icon as icon, root_category.aws_key as key, "
	 	clause =  _get_user_clause(need_rating) + match_book_genre_clause + _get_return_book_properties_clause(need_rating) 
	 	data = @neo.execute_query clause
	 	has_linked_books = data[0]["root_category"].blank? ? false : true rescue false
	 	
	 	unless has_linked_books
	 		find_genre_clause = "  MATCH (user:User)-[likes_category:Likes]->(root_category{is_root:true}) WHERE ALL(relation IN likes_category WHERE relation.weight > 0 ) WITH root_category, root_category.uuid AS root_uuid "
			get_linked_books_clause = "  MATCH initial_path = (root_category)-[:NextInCategory*" + (@skip_count.to_i + Constants::BookCountShownOnSignup.to_i).to_s + "]->(small_reads) WHERE ALL(relation IN relationships(initial_path) WHERE relation.from_category = root_uuid) "
			extract_books_from_list_clause = " WITH root_category, EXTRACT(n in nodes(initial_path)|n) AS books UNWIND books AS book WITH book, root_category ORDER BY book.total_weight DESC SKIP " + @skip_count.to_s + " LIMIT " + Constants::BookCountShownOnSignup.to_s 
			return_clause = " RETURN root_category.name as name, ID(root_category) as category_id, root_category.icon as icon, root_category.aws_key as key,  "
	 		clause = _get_user_clause + find_genre_clause + get_linked_books_clause + extract_books_from_list_clause + return_clause + _get_return_book_properties_clause 
	 		data = @neo.execute_query clause
	 	end
	 	data
	end

	def _handle_few_books_read 
		need_rating = true
		return_clause = " RETURN "
		clause = _get_user_clause(need_rating) + return_clause +  _get_return_book_properties_clause(need_rating)

		has_linked_books = data[0]["id"].blank? ? false : true rescue false
		unless has_linked_books
			if @skip_count == 0
				match_clause = " MATCH (small_read:Book) WHERE ID(small_read) = " + Constants::BestSmallRead.to_s
			else
				match_clause = " MATCH (best_small_read_book:Book)-[:NextSmallRead*" + @skip_count.to_s + "]-(small_read) WHERE ID(best_small_read_book) = " + Constants::BestSmallRead.to_s 
			end
			match_clause += " WITH small_read MATCH initial_path = (small_read)-[:NextSmallRead*" + Constants::BookCountShownOnSignup.to_s + "]->(last_book)"
			extract_clause = " WITH EXTRACT(n in nodes(initial_path)|n) AS books UNWIND books AS book RETURN "
			order_clause = " ORDER BY popularity "

			clause =  match_clause + extract_clause + _get_return_book_properties_clause + order_clause
		end
		clause
	end
end