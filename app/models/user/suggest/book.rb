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
		Era.new(@user_id).most_popular + @user.books_not_bookmarked + Book.order_desc + limit(Constants::RecommendationBookCount) + return(Book.basic_info, Era.basic_info)
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
		if favourites
			likes_category_value = " MAX(likes_category.weight)"
		else
			likes_category_value = " MIN(likes_category.weight)"
		end

		while data.length < 10
			if books_processed_count == 0
				match_user_to_category_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:NextInCategory]->(book) WITH root_category, user, book, " + likes_category_value + " AS likes_category_value MATCH (user)-[likes_category]->(root_category)-[:NextInCategory]->(book) WHERE likes_category.weight = likes_category_value "
			else
				match_user_to_category_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:NextInCategory*" + books_processed_count.to_s + "]-(book) WITH root_category, user, book, " + likes_category_value + " AS likes_category_value MATCH (user)-[likes_category]->(root_category)-[:NextInCategory*" + books_processed_count.to_s + "]-(book) WHERE likes_category.weight = likes_category_value  WITH root_category, user, book "
			end

			match_category_to_books_clause  = " MATCH path = (book)-[:NextInCategory*" + (Constants::RecommendationBookCount*10).to_s + "]-(next_book) WHERE ALL(relation IN relationships(path) WHERE relation.uuid = root_category.uuid) WITH user, root_category, FILTER(node IN nodes(path) WHERE NOT (user)-->(:MarkAsReadNode)-->(node)) AS books UNWIND books AS book WITH  book ORDER BY book.total_weight LIMIT " + Constants::RecommendationBookCount.to_s 
			return_clause = " RETURN category.name as name, ID(category) as id, "
			

			clause = self.match_user(@user_id) + match_user_to_category_clause + match_category_to_books_clause + return_clause + Book.get_basic_info
			data.push self.execute_query clause
			books_processed_count = books_processed_count + Constants::RecommendationBookCount*10
		end
		clause
	end
end