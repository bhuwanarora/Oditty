module PersonalisedBookSuggestionHelper

	def self.execute_query clause
		@neo ||= Neography::Rest.new
		data = @neo.execute_query clause
		data
	end

	def self.get_small_reads
		get_top_tiny_reads = " MATCH path = (book)-[:NextSmallRead*" + Constant::InteractionPoint::RecommendationBookCount.to_s + "]->(tiny_read) WHERE ID(book) = " + Constant::Id::BestSmallRead.to_s + " WITH EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book RETURN "
		clause = get_top_tiny_reads + self.get_return_clause
		data = self.execute_query clause
		data
	end

	def self.get_books_from_favourite_category(user_id, favourites = true)
		data = []
		books_processed_count = 0
		if favourites
			likes_category_sorting = " DESC "
		else
			likes_category_sorting = " "
		end

		while data.length < 10 
		
			get_mean_deviation_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true}) WITH TOFLOAT(SUM(likes_category.likeability_index)*1.0/COUNT(root_category)) AS mean_likeability_index, user "
			if books_processed_count == 0
				match_user_to_category_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:NextInCategory]->(book) " 
			else
				match_user_to_category_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true})-[:NextInCategory*" + books_processed_count.to_s + "]-(book)"
			end

			pick_category_clause = " WITH user, likes_category, root_category, mean_likeability_index, book, TOFLOAT(likes_category.likeability_index*1.0 - mean_likeability_index) AS mean_deviation ORDER BY mean_deviation " + likes_category_sorting + " LIMIT 1"


			match_category_to_books_clause  = " MATCH path = (book)-[:NextInCategory*" + (Constant::InteractionPoint::RecommendationBookCount*10).to_s + "]-(next_book) WHERE ALL(relation IN relationships(path) WHERE relation.uuid = root_category.uuid) WITH mean_deviation, user, root_category, FILTER(node IN nodes(path) WHERE NOT (user)-[:Labelled]->(:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(node)) AS books UNWIND books AS book WITH book, mean_deviation, root_category ORDER BY book.total_weight LIMIT " + Constant::InteractionPoint::RecommendationBookCount.to_s 
			return_clause = " RETURN mean_deviation, root_category.name AS name, ID(root_category) AS id, "
			

			clause = self.match_user(user_id) + get_mean_deviation_clause + match_user_to_category_clause + pick_category_clause +  match_category_to_books_clause + return_clause + self.get_return_clause
			(data.push self.execute_query clause).flatten!
			books_processed_count = books_processed_count + Constant::InteractionPoint::RecommendationBookCount*10
		end
		data
	end

	def self.get_books_from_favourite_author user_id
		most_read_author_clause = " OPTIONAL MATCH (user)-[:Labelled]->(:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(read_book:Book)<-[:Wrote]-(author:Author)-[:Wrote]->(book) WHERE NOT (user)-[:Labelled]->(:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(book) WITH user, author, book, COUNT(DISTINCT book) AS book_count ORDER BY book_count LIMIT 1 "
		unread_books_from_author_clause = " WITH author, book ORDER BY book.total_weight DESC LIMIT " + Constant::InteractionPoint::RecommendationBookCount.to_s
		return_clause = " RETURN author.name AS name, ID(author) AS id, "
		clause = self.match_user(user_id) + most_read_author_clause + unread_books_from_author_clause + return_clause + self.get_return_clause
		data = self.execute_query clause
		data
	end

	def self.get_books_from_most_bookmarked_era user_id
		max_read_era_clause = " OPTIONAL MATCH (user)-[:Labelled]->(:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(read_book:Book)-->(:Year)-->(era:`Era`)<--(:Year)<--(book:Book) WHERE NOT (user)-[:Labelled]->(:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(book) WITH book, user, era, COUNT(read_book) AS books_from_era ORDER BY books_from_era DESC LIMIT 1 "
		
		unread_books_from_era_clause = " WITH era, book ORDER BY book.total_weight DESC LIMIT " + Constant::InteractionPoint::RecommendationBookCount.to_s 
		return_clause = " RETURN era.name AS name, ID(era) AS id, "
		clause = self.match_user(user_id) + max_read_era_clause + unread_books_from_era_clause + return_clause + self.get_return_clause
		data = self.execute_query clause
		data
	end

	def self.get_books_on_friends_shelves user_id
		friends_reads_clause = " OPTIONAL MATCH (user)-[:Follows]->(friend:User)-->(:Label)-->(:BookmarkNode)-->(book:Book) WHERE NOT (user)-->(:Label)-->(:BookmarkNode)-->(book) WITH friend, book ORDER BY book.total_weight DESC LIMIT " + Constant::InteractionPoint::RecommendationBookCount.to_s

		return_clause =  " RETURN friend.name AS name, ID(friend) AS id, "
		clause = self.match_user(user_id) + friends_reads_clause + return_clause + self.get_return_clause
		data = self.execute_query clause
		data
	end

	private

	def self.get_return_clause 
		clause = " ID(book) AS book_id, book.isbn AS isbn, book.title AS title, book.author_name AS author_name, book.pages_count AS pages_count, book.published_year AS published_year, book.total_weight as popularity"
		clause
	end

	def self.match_user user_id
		clause = " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " WITH user"
		clause
	end
end