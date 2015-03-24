class User::Suggest::Book < User::Suggest
	def initialize user_id
		@user_id = user_id
		@user = User.new(@user_id)
	end

	def for_favourite_author
		most_read_author_clause = " OPTIONAL MATCH (user)-->(:BookmarkNode)-->(read_book:Book)<-[:Wrote]-(author:Author)-[:Wrote]->(book) WHERE NOT (user)-->(:BookmarkNode)-->(book) WITH user, author, book, COUNT(DISTINCT book) AS book_count ORDER BY book_count LIMIT 1 "
		unread_books_from_author_clause = " WITH author, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s
		return_clause = " RETURN author.name AS name, ID(author) AS id, "
		clause = @user.match + most_read_author_clause + unread_books_from_author_clause + return_clause + ::Book.basic_info 
		clause
	end

	def for_most_bookmarked_era
		Era.new(@user_id).most_popular + User.books_not_bookmarked + ", era " + ::Book.order_desc + limit(Constants::RecommendationBookCount) + return_group(::Book.basic_info, Era.basic_info)
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

	def self.get_popular_books skip_count
		if skip_count = 0
			clause = ::Book.new(Constants::BestBook).match
		else
			clause = "MATCH (b:Book) WHERE ID(b)="+Constants::BestBook.to_s+" MATCH p=(b)-[:Next_book*" + (skip_count.to_i).to_s + ".." + (19+skip_count.to_i).to_s + "]->(b_next) WITH last(nodes(p)) AS book"
		end
		mark_as_read_clause = " OPTIONAL MATCH (book)<-[:MarkAsRead]-(:MarkAsReadNode)<-[m:MarkAsReadAction]-(user:User) WHERE ID(user)="+user_id.to_s+" WITH user, book, m"
		rating_clause = " OPTIONAL MATCH (user)-[:RatingAction]->(z:RatingNode{book_id:ID(book), user_id:"+user_id.to_s+"})-[:Rate]->(book) WITH user, book, m, z"
		root_category_clause = " OPTIONAL MATCH (book)-[]->(category:Category{is_root: true})"
		return_clause = " RETURN book.isbn AS isbn, ID(book) AS id, book.title AS title, book.author_name AS author_name, ID(m) AS status, z.rating AS user_rating, book.published_year AS published_year, book.page_count AS page_count, COLLECT(category.id) AS categories_id, COLLECT(category.name) AS categories_name "
		clause = clause + mark_as_read_clause + rating_clause + root_category_clause + return_clause
		@neo = Neography::Rest.new
		begin
			books =  @neo.execute_query(clause)
			categories = []
			for book in books
				book["categories_name"].each_with_index do |category_name, index|
					category = {"name" => category_name, "id" => book["categories_id"][index]}
					categories.push category
				end
				book["categories"] = categories
				book.except!("categories_id")
				book.except!("categories_name")
			end
		rescue Exception => e
			puts e.to_s.red
			books = [{:message => "Error in finding books"}]
		end
		books
	end
end