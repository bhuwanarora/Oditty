
class User::Suggest::Book < User::Suggest
	def initialize user_id
		@user_id = user_id
	end

	def for_favourite_author
		most_read_author_clause = " OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book)<-[:Wrote]-(author:Author)-[:Wrote]->(book) WHERE NOT (user)-->(:BookmarkNode)-->(book) WITH user, author, book, COUNT(DISTINCT book) AS book_count ORDER BY book_count LIMIT 1 "
		unread_books_from_author_clause = " WITH author, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s
		return_clause = " RETURN author.name AS name, ID(author) AS id, "
		clause = @user.match + most_read_author_clause + unread_books_from_author_clause + return_clause + ::Book.basic_info 
		clause
	end

	def for_most_bookmarked_era
		Era.new(@user_id).most_popular + Bookmark::Object::Book.match_not + ", era " + ::Book.order_desc + limit(Constants::RecommendationBookCount) + return_group(::Book.basic_info, Era.basic_info)
	end

	def on_friends_shelves
		friends_reads_clause = " OPTIONAL MATCH (user)-[:Follows]->(friend:User)-[:Labelled]->(:Label{name:'CurrentlyReading'})-[:BookmarkedOn]->(:BookmarkNode)-->(book:Book) WHERE NOT (user)-->(:MarkAsReadNode)-->(book) WITH friend, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s

		return_clause =  " RETURN friend.name AS name, ID(friend) AS id, "
		clause = @user.match + friends_reads_clause + return_clause + ::Book.basic_info
		clause
	end

	def for_favourite_category(favourites = true)
		data = []
		books_processed_count = 0

		while data.length < 10
			clause = @user.match + User.match_custom_likeable_root_category(favourites) + ::Category::Root.get_books(books_processed_count, Constants::RecommendationBookCount*10) + Neo.new.return_group(::Book.basic_info, Category::Root.basic_info)
			data.push clause.execute
			books_processed_count = books_processed_count + Constants::RecommendationBookCount*10
		end
		data
	end

	def self.get_popular_books skip_count, user_id
		categories = []
		clause = ::Book.new(Constants::BestBook).match + ::Book.match_path("NextInCategory",skip_count) + " WITH last(nodes(path)) AS book "
		mark_as_read_clause = UsersBook.optional_match_mark_as_read + "WHERE ID(user) = " + user_id.to_s + UsersBook.optional_match_rating +  " WITH user, book, bookmark_node, rating_node "  
		root_category_clause = Book.match_root_category + " WITH user, book, bookmark_node, rating_node, root_category "
		return_clause = Neo.new.return_init + ::Book.detailed_info + " , " + " ID(bookmark_node) AS status, rating_node.rating AS user_rating, ID(root_category) AS category_id, root_category.name AS category_name "
		clause = clause + mark_as_read_clause + root_category_clause + return_clause
		books = clause.execute
		books.each.with_object({}){|book,labels| (categories[book["category_name"]] ||= [] ) << book }
		categories
	end
end