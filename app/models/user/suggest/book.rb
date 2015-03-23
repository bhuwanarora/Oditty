class User::Suggest::Book < User::Suggest
	def initialize user_id

		@user_id = user_id
		
	end

	def for_favourite_author
		most_read_author_clause = " OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book)<-[:Wrote]-(author:Author)-[:Wrote]->(book) WHERE NOT (user)-->(:BookmarkNode)-->(book) WITH user, author, book, COUNT(DISTINCT book) AS book_count ORDER BY book_count LIMIT 1 "
		unread_books_from_author_clause = " WITH author, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s
		return_clause = " RETURN author.name AS name, ID(author) AS id, "
		clause = self.match_user(@user_id) + most_read_author_clause + unread_books_from_author_clause + return_clause + Book.get_basic_info
		clause
	end

	def for_most_bookmarked_era
		max_read_era_clause = " OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book)-[:Published_in]-(:Year)-[:FromEra]->(era:Era) WITH user, era, COUNT(book) AS books_from_era ORDER BY books_from_era DESC LIMIT 1"
		
		unread_books_from_era_clause = " MATCH (book:Book)-[:Published_in]-(:Year)-[:FromEra]->(era) WHERE NOT (user)-->(:MarkAsReadNode)-->(book) WITH era, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s 
		return_clause = " RETURN era.name AS name, ID(era) AS id, "
		clause = self.match_user(@user_id) + max_read_era_clause + unread_books_from_era_clause + return_clause + Book.get_basic_info
		clause
	end

	def on_friends_shelves
		friends_reads_clause = " OPTIONAL MATCH (user)-[:Follows]->(friend:User)-->(:Label{name:'CurrentlyReading'})-->(:BookmarkNode)-->(book:Book) WHERE NOT (user)-->(:MarkAsReadNode)-->(book) WITH friend, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s

		return_clause =  " RETURN friend.name AS name, ID(friend) AS id, "
		clause = self.match_user(@user_id) + friends_reads_clause + return_clause + Book.get_basic_info
		clause
	end

	def for_favourite_category(user_id, books_processed_count, favourites = true)
		if favourites
			likes_category_value = " MAX(likes_category.weight)"
		else
			likes_category_value = " MIN(likes_category.weight)"
		end

		if books_processed_count == 0
			match_user_to_category_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:NextInCategory]->(book) WITH root_category, user, book, " + likes_category_value + " AS likes_category_value MATCH (user)-[likes_category]->(root_category)-[:NextInCategory]->(book) WHERE likes_category.weight = likes_category_value "
		else
			match_user_to_category_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:NextInCategory*" + books_processed_count.to_s + "]-(book) WITH root_category, user, book, " + likes_category_value + " AS likes_category_value MATCH (user)-[likes_category]->(root_category)-[:NextInCategory*" + books_processed_count.to_s + "]-(book) WHERE likes_category.weight = likes_category_value  WITH root_category, user, book "
		end

		match_category_to_books_clause  = " MATCH path = (book)-[:NextInCategory*" + (Constants::RecommendationBookCount*10).to_s + "]-(next_book) WHERE ALL(relation IN relationships(path) WHERE relation.uuid = root_category.uuid) WITH user, root_category, FILTER(node IN nodes(path) WHERE NOT (user)-->(:MarkAsReadNode)-->(node)) AS books UNWIND books AS book WITH  book ORDER BY book.total_weight LIMIT " + Constants::RecommendationBookCount.to_s 
		return_clause = " RETURN category.name as name, ID(category) as id, "
		

		clause = self.match_user(@user_id) + match_user_to_category_clause + match_category_to_books_clause + return_clause + Book.get_basic_info
	end
end