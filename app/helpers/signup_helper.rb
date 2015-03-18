module SignupHelper
	class BooksFinder

		def initialize user_id, skip_count
			@neo ||= Neography::Rest.new
			@limit = Constants::BookCountShownOnSignup
			range = _get_user_book_count user_id
			skip_count = skip_count.to_i > @limit ? skip_count.to_i : Constants::InitialSkipCount  

			case range
			when Constants::ChildBookCountRange
				data = _handle_few_books_read(user_id, skip_count)
			when Constants::AdoloscentBookCountRange
				data = _handle_average_number_books_read(user_id, skip_count)
			when Constants::AboutToBeAdultBookCountRange
				data = _handle_average_number_books_read(user_id, skip_count)
			when Constants::AdultBookCountRange
				data = _handle_average_number_books_read(user_id, skip_count)
			when Constants::AboutToDieBookCountRange
				data = _handle_average_number_books_read(user_id, skip_count)
			end
			data
		end


		private
	
		def _handle_few_books_read user_id, skip_count
			need_rating = true
			return_clause = " RETURN "
			clause = _get_user_clause(user_id, need_rating) + return_clause +  _get_return_book_properties_clause(need_rating)
			data = @neo.execute_query clause

			has_linked_books = data[0]["id"].blank? ? false : true rescue false

			unless has_linked_books

				get_ten_small_books_clause = " MATCH initial_path = (best_small_read_book:Book)-[:NextSmallRead*" + skip_count.to_s + "]-(small_read) WHERE ID(best_small_read_book) = " + Constants::BestSmallRead.to_s 
				sort_books_clause = " WITH EXTRACT(n in nodes(initial_path)|n) AS books UNWIND books AS book RETURN "
				order_clause = " ORDER BY popularity LIMIT " + Constants::BookCountShownOnSignup.to_s

				clause =  get_ten_small_books_clause + sort_books_clause + _get_return_book_properties_clause + order_clause
				data = @neo.execute_query clause
			end
		end

		def _get_return_book_properties_clause need_rating = false
			return_book_properties_clause = " ID(book) AS id, book.isbn AS isbn, book.title AS title, book.author_name AS author_name, book.pages AS pages, book.published_year AS year, book.total_weight as popularity"
			return_ratings_clause = ", ID(mark_as_read) AS status, rating_node.rating AS user_rating" 
			if need_rating
				clause = return_book_properties_clause + return_ratings_clause
			else 
				clause = return_book_properties_clause
			end
			clause
		end

		def _get_user_clause user_id, need_rating = false
			get_user_clause = " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " WITH user "
			if need_rating
				get_rating_node_clause = " OPTIONAL MATCH (user:User)-[mark_as_read:MarkAsReadAction]->(:MarkAsReadNode)--(book:Book), (user)-[:RatingAction]->(rating_node:RatingNode{book_id:ID(book)}) WITH user, book, mark_as_read, rating_node"
				get_user_clause += get_rating_node_clause
			end
			get_user_clause
		end

		def _get_user_book_count user_id
			clause = " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " RETURN user.init_book_read_count as init_book_read_count"
			puts clause.blue.on_red
			range = @neo.execute_query(clause)[0]["init_book_read_count"]
			range
		end

		def _handle_average_number_books_read user_id, skip_count
		 	need_rating = true
		 	match_book_genre_clause = "  MATCH (book)-[:FromCategory]->(:Category)-[HasRoot*0..1]->(root_category{is_root:true}) WITH book, mark_as_read, root_category, rating_node ORDER BY book.total_weight DESC LIMIT " + @limit.to_s + " RETURN root_category.name AS root_category ,"
		 	sort_clause =  ", COUNT(book) AS book_count ORDER BY book_count DESC "
		 	clause =  _get_user_clause(user_id, need_rating) + match_book_genre_clause + _get_return_book_properties_clause(need_rating) + sort_clause
		 	data = @neo.execute_query clause 
		 	has_linked_books = data[0]["root_category"].blank? ? false : true rescue false
		 
		 	unless has_linked_books
		 		find_genre_clause = "  MATCH (user:User)-[:Likes]->(root_category{is_root:true}) WITH root_category, root_category.uuid AS root_uuid "
		 		find_books_linked_clause = "MATCH path = (root_category)-[:NextInGenre*" + skip_count.to_i.to_s + "]->(popular_books) WHERE ALL(relation in RELATIONSHIPS(path) WHERE relation.uuid = root_uuid)  WITH EXTRACT(n IN nodes(path)| n) AS books, root_category UNWIND books AS book RETURN root_category AS root_category, "
		 		limit_clause = " ORDER BY popularity LIMIT " + Constants::BookCountShownOnSignup.to_s
		 		clause = _get_user_clause(user_id) + find_genre_clause + find_books_linked_clause + _get_return_book_properties_clause + limit_clause
		 		data = @neo.execute_query clause
		 	end
		end
	end
end