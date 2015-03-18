module SignupHelper
	class BooksFinder

		def get_sorted_books user_id, skip_count
			@neo ||= Neography::Rest.new
			@limit = Constants::BookCountShownOnSignup
			range = _get_user_book_count user_id
			skip_count = skip_count.to_i > @limit ? skip_count.to_i : Constants::InitialSkipCount  

			case range
			when Constants::FewBooksReadCountRange
				data = handle_few_books_read(user_id, skip_count)
			else 
				data = handle_average_number_books_read(user_id, skip_count)
			end
			data
		end

		def get_sorted_genres user_id
			@neo ||= Neography::Rest.new
			match_user_clause = " MATCH (user:User)-[likes_category:Category{is_root:true}]->(root_category:Category) WHERE ID(user) =  " + user_id.to_s 
			sort_genres_clause = " WITH likes_category.weight AS user_likeability, root_category RETURN root_category.name AS category, root_category.id AS category_id ORDER BY user_likeability DESC"
			clause = match_user_clause + sort_genres_clause
			@neo.execute_query clause
		end

		private
	
		def handle_few_books_read user_id, skip_count
			need_rating = true
			return_clause = " RETURN "
			clause = _get_user_clause(user_id, need_rating) + return_clause +  _get_return_book_properties_clause(need_rating)
			data = @neo.execute_query clause

			has_linked_books = data["book_ids"].blank? ? false : true rescue false

			unless has_linked_books

				get_ten_small_books_clause = " MATCH initial_path = (best_small_read_book:Book)-[:NextSmallRead*" + skip_count.to_s + "]-(small_read) WHERE ID(best_small_read_book) = " + Constants::BestSmallRead.to_s 
				sort_books_clause = " WITH EXTRACT(n in nodes(initial_path)|n) AS books UNWIND books AS book RETURN "
				order_clause = " ORDER BY popularity"

				clause =  get_ten_small_books_clause + sort_books_clause + _get_return_book_properties_clause + order_clause
				data = @neo.execute_query clause
			end
		end

		def _get_return_book_properties_clause need_rating = false
			return_book_properties_clause = " ID(book) AS book_ids, book.isbn AS isbn, book.title AS title, book.author_name AS author, book.pages AS pages, book.published_year AS year, book.total_weight as popularity"
			return_ratings_clause = ", ID(mark_as_read) AS mark_as_read_node_id, rating_node.rating AS rating" 
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
				get_rating_node_clause = "OPTIONAL MATCH (user:User)-[mark_as_read:MarkAsReadAction]->(:MarkAsReadNode)--(book:Book), (user)-[:RatingAction]->(rating_node:RatingNode{book_id:ID(book)}) WITH user, book, mark_as_read, rating_node"
				get_user_clause += get_rating_node_clause
			end
			get_user_clause
		end

		def _get_user_book_count user_id
			count_match_clause = " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " RETURN user.init_book_read_count as init_book_count"
			range = (@neo.execute_query count_match_clause)["init_book_count"] rescue 0
		end

		def handle_average_number_books_read user_id, skip_count
		 	need_rating = true
		 	match_book_genre_clause = "  MATCH (book)-[:FromCategory]->(:Category)-[HasRoot*0..1]->(root_category{is_root:true}) WITH book, mark_as_read, root_category, rating_node ORDER BY book.total_weight DESC LIMIT " + @limit.to_s + " RETURN root_category.name AS root_category ,"
		 	sort_clause =  ", COUNT(book) AS book_count ORDER BY book_count DESC "
		 	clause =  _get_user_clause(user_id, need_rating) + match_book_genre_clause + _get_return_book_properties_clause(need_rating) + sort_clause
		 	data = @neo.execute_query clause 
		 	has_linked_books = data["root_category"].blank? ? false : true rescue false
		 
		 	unless has_linked_books
		 		find_genre_clause = "  MATCH (user:User)-[:Likes]->(root_category{is_root:true}) WITH root_category, root_category.uuid AS root_uuid "
		 		find_books_linked_clause = "MATCH path = (root_category)-[:NextInGenre*" + skip_count.to_i.to_s + "]->(popular_books) WHERE ALL(relation in RELATIONSHIPS(path) WHERE relation.uuid = root_uuid)  WITH EXTRACT(n IN nodes(path)| n) AS books, root_category UNWIND books AS book RETURN root_category AS root_category, "
		 		limit_clause = " ORDER BY popularity LIMIT " + Constants::BookCountShownOnSignup.to_s
		 		clause = _get_user_clause(user_id) + find_genre_clause + find_books_linked_clause + _get_return_book_properties_clause + limit_clause
		 		data = @neo.execute_query clause
		 	end
		end

		def self.get_book_categories book_id
			match_book_category_clause = " MATCH (book:Book)-[:FromCategory]-(category:Category) WHERE ID(book) = " + book_id.to_s + " WITH book, category"
			find_shortest_path_to_root = " OPTIONAL MATCH (category)<-[to_child:HasChild*0..]-(root_category:Category{is_root:true}) WITH category, LENGTH(to_child) AS depth RETURN category ORDER BY depth LIMIT 5"

		end
	end
end