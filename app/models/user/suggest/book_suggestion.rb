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

 		@user.match + @user.favourite_author + User::Suggest::BookSuggestion.order_init + " book_count DESC " + User::Suggest::BookSuggestion.limit(8) +  "WITH author, user " + Author.match_books + ", user " + Bookmark.match_not("book") + User::Suggest::BookSuggestion.with_group("book", "author") + User::Suggest::BookSuggestion.order_init + " toINT(book.total_weight) DESC " + User::Suggest::BookSuggestion.return_group(Author.basic_info, "COLLECT({"+Book.grouped_basic_info+"})[0..8] AS books")
	end

	def for_most_bookmarked_era
		Era.most_popular(@user_id) + " WITH user, era " + Era.match_books + " , user " + Bookmark::Node::BookLabel.match_not + " WITH user, book, era " + ::Book.order_desc + " WITH user, era, #{User::Suggest::BookSuggestion.collect_map("books" => Book.grouped_basic_info)} WITH #{User::Suggest::BookSuggestion.collect_map("info" => Era.grouped_basic_info)}, books[0..#{Constant::Count::BookRecommendation}] AS books " + User::Suggest::BookSuggestion.return_group("info", "books")
	end

	def on_friends_shelves
		@user.match + UsersUser.match + Bookmark.match_path("book","friend") + Bookmark.match_not("book") + " WITH user, friend , book " +  ::Book.order_desc + " WITH friend AS user, #{User::Suggest::BookSuggestion.collect_map("books" => Book.grouped_basic_info)} WITH #{User::Suggest::BookSuggestion.collect_map("info" => User.grouped_basic_info)}, books[0..4] AS books " + User::Suggest::BookSuggestion.return_group("info", "books")  
	end

	def for_likeable_category(favourites = true, books_processed_count=0)
		@user.match + User.match_custom_likeable_root_category(favourites) + ::Category::Root.match_books_in_list(books_processed_count, Constant::Count::BookRecommendation*10) + @user.match + ", book, root_category " + Bookmark.match_not("book") + User::Suggest::BookSuggestion.return_group(::Book.basic_info, Category::Root.basic_info)
	end

	def self.get_popular_books skip_count, user_id
		# get nth node from the beginning
		# get books after nth node
		Book.new(Constant::Id::BestBook).match + " AS best_book MATCH (best_book)-[:Next_book*" + skip_count.to_s + "]->(book) WITH book " + ::Book.match_path("Next_book",Constant::Count::PopularBooksShown) + " WITH " +  User::Suggest::BookSuggestion.extract_unwind("book") + UsersBook.optional_match_bookmark + "WHERE ID(user) = " + user_id.to_s + UsersBook.optional_match_rating + " WITH user, book, bookmark_node, rating_node " + Book.optional_match_root_category + ", bookmark_node, rating_node, user "+ User::Suggest::BookSuggestion.return_group(Book.detailed_info, Bookmark.grouped_basic_info, Rating.grouped_basic_info,  " root_category ")
	end
end