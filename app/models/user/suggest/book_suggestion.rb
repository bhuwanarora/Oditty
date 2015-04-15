class User::Suggest::BookSuggestion < User::Suggest
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def for_favourite_author
		label = 'read_book'
		label_defined = true
		# find user
		# books bookmarked by the user
		# all authors
		# most bookmarked author
		# other books from author

		@user.match + @user.authors_of_books_bookmarked + Author.match_books + Bookmark.match_not("book") + User::Suggest::BookSuggestion.with_group(label, " user ","author "," book "," COUNT(DISTINCT "+label+") AS book_count ") + User::Suggest::BookSuggestion.order_init + " book_count " + User::Suggest::BookSuggestion.limit(1) + User::Suggest::BookSuggestion.return_group(Author.basic_info, ::Book.basic_info) + ::Book.order_desc + User::Suggest::BookSuggestion.limit(Constant::Count::BookRecommendation)
	end

	def for_most_bookmarked_era
		Era.most_popular(@user_id) + Bookmark::Node::BookLabel.match_not + User::Suggest::BookSuggestion.return_group(::Book.basic_info, Era.basic_info) + ::Book.order_desc + User::Suggest::BookSuggestion.limit(Constant::Count::BookRecommendation)
	end

	def on_friends_shelves
		return_clause =  " RETURN friend.name AS name, ID(friend) AS id, "
		clause = @user.match + UsersUser.match + Bookmark.match_path("book",false,"friend") + Bookmark.match_not("book") + User::Suggest::BookSuggestion.return_group("friend.name AS name", "ID(friend) AS id", ::Book.basic_info) + ::Book.order_desc + User::Suggest::BookSuggestion.limit(Constant::Count::BookRecommendation) 
	end

	def for_likeable_category(favourites = true, books_processed_count=0)
		@user.match + User.match_custom_likeable_root_category(favourites) + ::Category::Root.match_books_in_list(books_processed_count, Constant::Count::BookRecommendation*10) + @user.match + ", book, root_category " + Bookmark.match_not("book") + User::Suggest::BookSuggestion.return_group(::Book.basic_info, Category::Root.basic_info)
	end

	def self.get_popular_books skip_count, user_id
		# get nth node from the beginning
		# get books after nth node
		Book.new(Constants::BestBook).match + " AS best_book MATCH (best_book)-[:Next_book*" + skip_count.to_s + "]->(book) WITH book " + ::Book.match_path("Next_book",Constants::Count::PopularBooksShownCount) + " WITH " +  User::Suggest::BookSuggestion.extract_unwind("book") + UsersBook.optional_match_bookmark + "WHERE ID(user) = " + user_id.to_s + UsersBook.optional_match_rating + " WITH user, book, bookmark_node, rating_node " + Book.optional_match_root_category + ", bookmark_node, rating_node, user "+ User::Suggest::BookSuggestion.return_group(Book.detailed_info, Bookmark.grouped_basic_info, Rating.grouped_basic_info,  " root_category ")
	end
end