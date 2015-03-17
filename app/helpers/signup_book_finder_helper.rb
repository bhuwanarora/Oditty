module SignupBookFinderHelper
	class SignupBookFinder

		def initialize user_id, skip_count
			find_books_on_count (user_id, skip_count)
		end

		def find_books_on_count (user_id, skip_count)
			limit = Constants::BookCountShownOnSignup
			range = _get_user_book_count user_id
			skip_count = skip_count.to_i > limit ? skip_count.to_i : Constants::InitialSkipCount  

			case range
			when Constants::FewBooksReadCountRange
				user_case_clause = " RETURN ID(book) as book_ids ORDER BY book.total_weight "
				clause = (_get_user_clause user_id) + user_case_clause
				data = neo.execute_query clause

				has_linked_books = data["book_ids"].blank? ? false : true

				unless has_linked_books
					get_ten_small_books_clause = " MATCH initial_path = (initial_small_read_book:Book)-[:NextSmallRead*" + skip_count.to_s + "]-(small_read) WHERE ID(inital_small_read_book) = " + Constants::MostPopularSmallReadID.to_s 
					sort_books_clause = "WITH small_read MATCH small_read_path = (small_read)-[:NextSmallRead*" + limit.to_s + "] RETURN EXTRACT(n in nodes(small_read_path)|ID(n)) AS book_ids "

					clause = get_user_book_count + get_ten_small_books_clause + sort_books_clause
					data = (neo.execute_query clause)
				end
			else 
				# Constants::AverageBooksReadCountRange.include? range
			 
			 	match_book_genre_clause = "  MATCH book-[:FromCategory]->(:Category)-[HasRoot*0..1]->(root_category{is_root:true}) WITH book, root_category ORDER BY book.total_weight DESC LIMIT " + limit.to_s + " RETURN root_category.name AS root_category, COLLECT(DISTINCT(book.title)) AS book_title, COUNT(book) AS book_count ORDER BY book_count DESC "
			 	clause =  _get_user_clause + match_book_genre_clause
			 	data = neo.execute_query clause 

			 	has_linked_books = data["root_category"].blank? ? false : true
			 
			 	unless has_linked_books
			 		find_genre_clause = "  MATCH (user:User)-[:Likes]->(root_category{is_root:true}) WITH root_category, root_category.uuid AS root_uuid "
			 		find_books_linked_clause = "MATCH path = (root_category)-[:NextInGenre*" + skip_count.to_i.to_s + "]->(popular_books) WHERE ALL(relation in RELATIONSHIPS(path) WHERE relation.uuid = root_uuid)  WITH EXTRACT(n IN nodes(path)| book) AS books, root_category UNWIND books AS book RETURN root_category, book ORDER BY book.total_weight SKIP " + skip_count.to_i.to_s + " LIMIT" + Constants::BookCountShownOnSignup.to_s
			 		clause = _get_user_clause + find_genre_clause + find_books_linked_clause
			 		
			 		data = neo.execute_query clause
			 	end
			end
			data
		end

		private

		def _get_user_clause user_id
				general_clause = " OPTIONAL MATCH (user:User)--(:MarkAsReadNode)--(book:Book) WHERE ID(user) = " + user_id.to_s + "  WITH user, book"
		end

		def _get_user_book_count user_id
			count_match_clause = " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " RETURN user.init_book_read_count as init_book_count"
			range = (neo.execute_query count_match_clause)["init_book_count"]
		end
	end
end