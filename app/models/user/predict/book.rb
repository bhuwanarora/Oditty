class User::Predict::Book < User::Predict
	Limit = 30


	def initialize(user_id, skip_count)
		@user_id = user_id
		@skip_count = skip_count
		@user = User.new(user_id)
	end

	def likely_books_read
		range = @user.get_init_book_count_range.execute[0]["init_book_read_count"]
		case range
		when Constants::ChildBookCountRange
			data = handle_few_books_read
		when Constants::AdoloscentBookCountRange
			data = handle_average_number_books_read
		when Constants::AboutToBeAdultBookCountRange
			data = handle_average_number_books_read
		when Constants::AdultBookCountRange
			data = handle_average_number_books_read
		when Constants::AboutToDieBookCountRange
			data = handle_average_number_books_read
		end
		data
	end

	def handle_average_number_books_read skip_count=0, limit_count = Constants::BookCountShownOnSignup
	 	
	 	 match_clause = " MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book)-[:FromCategory]->(:Category)-[HasRoot*0..1]->(root_category{is_root:true}),(user)-[:RatingAction]-(rating_node:`RatingNode`)-[:Rate]-(book) WHERE ID(user) = "  + @user_id.to_s + " WITH book, root_category  AS category, rating_node "
	 	return_clause = return_init + ::Category.basic_info + " ,rating_node.rating AS user_rating, "+ ::Book.basic_info + ::Book.order_desc + skip(skip_count) + limit(limit_count) 

		clause = match_clause + return_clause
		data = clause.execute 	

	 	has_linked_books = data[0]["book_id"].blank? ? false : true rescue false
		unless has_linked_books
	 	
	 		find_genre_clause = "  MATCH (user:User)-[likes_category:Likes]->(root_category{is_root:true})-[:NextInCategory]->(book_in_category:Book) WHERE likes_category.weight > 0 AND ID(user) = " + @user_id.to_s + " WITH root_category AS category, root_category.uuid AS root_uuid, book_in_category "
			get_linked_books_clause = "  MATCH initial_path = (book_in_category)-[:NextInCategory*" + @skip_count.to_s + "]->(category_book) WHERE ALL(relation IN relationships(initial_path) WHERE relation.from_category = root_uuid) "
			extract_books_from_list_clause = " WITH category, EXTRACT(n in nodes(initial_path)|n) AS books UNWIND books AS book WITH book, category AS category"
			return_clause = return_init + ::Category.basic_info + "," + ::Book.basic_info + ::Book.order_desc + skip(skip_count) + limit(limit_count) 
			clause = find_genre_clause + get_linked_books_clause + extract_books_from_list_clause + return_clause
			clause.execute
	 	end
	end

	def handle_few_books_read 
		data = @user.get_all_books.execute

		has_linked_books = data[0]["book_id"].blank? ? false : true rescue false
		unless has_linked_books
			clause =  ::Book::SmallRead.get_sorted_books @skip_count
			data = clause.execute
		end
		data
	end
end