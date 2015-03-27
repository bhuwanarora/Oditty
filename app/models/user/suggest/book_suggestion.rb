class User::Suggest::BookSuggestion < User::Suggest
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def for_favourite_author
		@user.match + Bookmark.match_path("read_book",label_defined=true) + Neo.new.with_group("read_book", "user") + Author.match_path("author","read_book") + Neo.new.with_group(" user "," author "," read_book ") + Author.match_path("author","book",label_defined=true) + Bookmark.match_not("book") + Neo.new.with_group(" read_book "," user ","author "," book "," COUNT(DISTINCT read_book) AS book_count ") + Neo.new.order_init + " book_count " + Neo.new.limit(1) + Neo.new.return_group(Author.basic_info,::Book.basic_info) + ::Book.order_desc + limit(Constants::RecommendationBookCount)
	end

	def for_most_bookmarked_era
		Era.new(@user_id).most_popular + Bookmark::Node::BookLabel.match_not + return_group(::Book.basic_info, Era.basic_info) + ::Book.order_desc + limit(Constants::RecommendationBookCount)
	end

	def on_friends_shelves
		return_clause =  " RETURN friend.name AS name, ID(friend) AS id, "
		clause = @user.match + UsersUser.match + Neo.new.with_group("user","friend") + Bookmark.match_path("book",false,"friend") + Bookmark.match_not("book") + Neo.new.return_group("friend.name AS name", "ID(friend) AS id", ::Book.basic_info) + ::Book.order_desc + limit(Constants::RecommendationBookCount) 
	end

	def for_likeable_category(favourites = true, books_processed_count=0)
		@user.match + User.match_custom_likeable_root_category(favourites) + ::Category::Root.get_books(books_processed_count, Constants::RecommendationBookCount*10) + @user.match + ", book, root_category " + Bookmark.match_not("book") + Neo.new.new.return_group(::Book.basic_info, Category::Root.basic_info)
	end

	def self.get_popular_books skip_count, user_id
		::Book.new(Constants::BestBook).match + " AS best_book MATCH (best_book)-[:Next_book*" + skip_count.to_s + "]->(book) WITH book " + ::Book.match_path("Next_book",Constants::PopularBooksShownCount) + " WITH " +  Neo.new.extract("books") + Neo.new.unwind("books") + Neo.new.new.return_init + ::Book.detailed_info 
	end
end