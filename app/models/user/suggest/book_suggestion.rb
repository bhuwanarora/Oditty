class User::Suggest::BookSuggestion < User::Suggest
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def for_favourite_author
		most_read_author_clause = " OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(read_book)<-[:Wrote]-(author:Author)-[:Wrote]->(book) WHERE NOT (user)-[:Labelled]->(:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(book) WITH read_book ,user, author, book, COUNT(DISTINCT read_book) AS book_count ORDER BY book_count LIMIT 1 "
		unread_books_from_author_clause = " WITH author, book ORDER BY read_book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s
		return_clause = " RETURN author.name AS name, ID(author) AS id, "
		clause = @user.match + most_read_author_clause + unread_books_from_author_clause + return_clause + ::Book.basic_info 
		clause
	end

	def for_most_bookmarked_era
		Era.new(@user_id).most_popular + Bookmark::Node::BookLabel.match_not + return_group(::Book.basic_info, Era.basic_info) + ::Book.order_desc + limit(Constants::RecommendationBookCount)
	end

	def on_friends_shelves
		friends_reads_clause = " OPTIONAL MATCH (user)-[:Follows]->(friend:User)-[:Labelled]->(:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(book:Book) WHERE NOT (user)-[:Labelled]->(:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(book) WITH friend, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s

		return_clause =  " RETURN friend.name AS name, ID(friend) AS id, "
		clause = @user.match + friends_reads_clause + return_clause + ::Book.basic_info
		clause
	end

	def for_likeable_category(favourites = true, books_processed_count=0)
		clause = @user.match + User.match_custom_likeable_root_category(favourites) + ::Category::Root.get_books(books_processed_count, Constants::RecommendationBookCount*10) + @user.match + ", book, root_category " + Bookmark.match_not("book") + Neo.new.return_group(::Book.basic_info, Category::Root.basic_info)
	end

	def self.get_popular_books skip_count, user_id
		clause = ::Book.new(Constants::BestBook).match + " AS best_book MATCH (best_book)-[:Next_book*" + skip_count.to_s + "]->(book) WITH book " + ::Book.match_path("Next_book",Constants::PopularBooksShownCount) + " WITH " +  Neo.extract("books") + Neo.unwind("books") + Neo.new.return_init + ::Book.detailed_info 
	end
end