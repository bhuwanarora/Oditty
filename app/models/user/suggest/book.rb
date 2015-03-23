class User::Suggest::Book < User::Suggest
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def for_favourite_author
		most_read_author_clause = " OPTIONAL MATCH (user)-->(:BookmarkNode)-->(read_book:Book)<-[:Wrote]-(author:Author)-[:Wrote]->(book) WHERE NOT (user)-->(:BookmarkNode)-->(book) WITH user, author, book, COUNT(DISTINCT book) AS book_count ORDER BY book_count LIMIT 1 "
		unread_books_from_author_clause = " WITH author, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s
		return_clause = " RETURN author.name AS name, ID(author) AS id, "
		clause = self.match_user(@user_id) + most_read_author_clause + unread_books_from_author_clause + return_clause + Book.get_basic_info
		clause
	end

	def for_most_bookmarked_era
		Era.new(@user_id).most_popular + @user.books_not_bookmarked + Book.order_desc + limit(Constants::RecommendationBookCount) + return_group(Book.basic_info, Era.basic_info)
	end

	def on_friends_shelves
		" OPTIONAL MATCH (user)-[:Follows]->(friend:User)-[:Labelled]->(:Label{name:'CurrentlyReading'})-[:BookmarkedOn]->(:BookmarkNode)-->(book:Book) WHERE NOT (user)-->(:MarkAsReadNode)-->(book) WITH friend, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s

		return_clause =  " RETURN friend.name AS name, ID(friend) AS id, "
		clause = self.match_user(@user_id) + friends_reads_clause + return_clause + Book.get_basic_info
		clause
	end

	def for_favourite_category(favourites = true)
		data = []
		books_processed_count = 0

		while data.length < 10
			clause = @user.match + User.match_custom_likeable_root_category(favourites) + Category::Root.get_books(books_processed_count, Constants::RecommendationBookCount*10) + Neo.new.return_group(Book.basic_info, Category::Root.basic_info)
			data.push clause.execute
			books_processed_count = books_processed_count + Constants::RecommendationBookCount*10
		end
		clause
	end
end