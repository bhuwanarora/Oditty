module PersonalisedBookSuggestionHelper

	def self.execute_query clause
		@neo ||= Neography::Rest.new
		data = @neo.execute_query clause
		data
	end

	def self.get_tiny_reads
		get_top_ten_tiny_reads_clause = " MATCH path = (book)-[:NextTinyRead*" + Constants::PersonalisedBookRecommendationBookCount.to_s + "]->(tiny_reads) WHERE ID(book) = " + Constants::BestTinyRead.to_s + " WITH EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book RETURN "
		get_book_property_clause = self.get_return_book_properties_clause 
		clause = get_top_ten_tiny_reads + get_book_property_clause
		data = self.execute_query clause
		data
	end

	def self.get_books_from_likeable_category(user_id, get_most_liked_category = true)
		data = []
		books_processed_count = 0
		if get_most_liked_category
			likes_category_value = " MAX(likes_category.weight)"
		else
			likes_category_value = " MIN(likes_category.weight)"
		end

		while data.length < 10
			if books_processed_count = 0
				match_user_to_category_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:FromCategory]->(best_in_category) WITH root_category, user, best_in_category, " + likes_category_value + " AS likes_category_value MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:FromCategory]->(best_in_category) WHERE likes_category.weight = likes_category_value "
			else
				match_user_to_category_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:FromCategory*" + books_processed_count.to_s + "]-(best_in_category) WITH root_category, user, best_in_category, " + likes_category_value + " AS likes_category_value MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:FromCategory*" + books_processed_count.to_s + "]-(best_in_category) WHERE likes_category.weight = likes_category_value  WITH root_category, user, best_in_category "
			end

			match_category_to_books_clause " MATCH path = (best_in_category)-[:FromCategory*" + Constants::PersonalisedBookRecommendationBookCount*10.to_s + "]-(books_from_category) WHERE ALL(relation IN relationships(path) WHERE relation.from_category = root_category.uuid) WITH user, root_category, FILTER(node IN nodes(path) WHERE NOT (user)-->(:MarkAsReadNode)-->(node)) AS books UNWIND books AS book WITH  book ORDER BY book.total_weight LIMIT " + Constants::PersonalisedBookRecommendationBookCount.to_s 
			return_clause = "   RETURN "
			

			clause = self.match_user(user_id) + match_user_to_category_clause + match_category_to_books_clause + return_clause + self.get_return_book_properties_clause
			data << self.execute_query clause
			books_processed_count = books_processed_count + Constants::PersonalisedBookRecommendationBookCount*10
		end
		data
	end

	def self.get_books_from_most_read_author user_id
		get_most_read_author_clause = "OPTIONAL MATCH (user)-->(:BookmarkNode)-->(book:Book)<-[:Wrote]-(author:Author)-[:Wrote]-(books) WHERE NOT (user)-->(:BookmarkNode)-->(books) WITH user, author, books, COUNT(DISTINCT book) AS book_count ORDER BY book_count LIMIT 1"
		get_unread_books_from_author_clause = " WITH author, books ORDER BY books.total_weight DESC LIMIT 10"
		return_clause = "RETURN author.name AS author_name, ID(author) AS author_id , "
		clause = self.match_user(user_id) + get_most_read_author_clause + get_unread_books_from_author_clause + return_clause + self.get_return_book_properties_clause
		data = self.execute_query clause
		data
	end

	def self.get_books_from_most_read_era user_id
		get_max_read_era_clause = "OPTIONAL MATCH (user)-->(:BookmarkNode)-->(book:Book)-[:Published_in]-(:Year)-[:FromEra]->(era:Era) WITH era, COUNT(book) AS books_from_era ORDER BY books_from_era DESC LIMIT 1"
		
		get_unread_books_from_era_clause = " MATCH (book:Book)-[:Published_in]-(:Year)-[:FromEra]->(era) WHERE NOT (user)-->(:MarkAsReadNode)-->(book) WITH era, book ORDER BY book.total_weight DESC LIMIT 10"
		return_clause = "RETURN era.name AS era_name, ID(era) AS era_id , "
		clause = self.match_user(user_id) + get_most_read_author_clause + get_unread_books_from_author_clause + return_clause + self.get_return_book_properties_clause
		data = self.execute_query clause
		data

		clause = self.match_user(user_id) + get_max_read_era_clause
		data = self.execute_query clause
		data
	end

	def self.books_on_your_friends_shelves user_id
		get_friends_reads_clause = " OPTIONAL MATCH (user)-[:Follows]->(friend):User-->(:Label{name:'CurrentlyReading'})-->(:BookmarkNode)--(book:Book) WHERE NOT (user)-->(:MarkAsReadNode)-->(book) WITH friend, book ORDER BY book.total_weight DESC LIMIT 10 "

		return_clause =  "RETURN friend.name AS friend_name, ID(friend) AS friend_id, "
		clause = self.match_user(user_id) + get_friends_reads_clause + return_clause + self.get_return_book_properties_clause
		data = self.execute_query clause
		data
	end

	private

	def self.get_return_book_properties_clause 
		clause = " ID(book) AS id, book.isbn AS isbn, book.title AS title, book.author_name AS author_name, book.pages_count AS pages_count, book.published_year AS published_year, book.total_weight as popularity"
		clause
	end

	def self.match_user user_id
		clause = " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " WITH user"
		clause
	end
end