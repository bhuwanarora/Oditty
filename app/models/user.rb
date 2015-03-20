class User < Neo

	def initialize user_id, skip_count=0
			@limit = Constants::BookCountShownOnSignup
			@user_id = user_id
			@skip_count = skip_count
	end

	def self.from_facebook params
		begin
			if params[:data].class == Array
				params[:data].each do |book_data|
					book = book_data["data"]["book"]
					indexed_title = book["title"].gsub(" ", "").downcase
					url_splitter = book["url"].split("/")
					url_id = url_splitter[url_splitter.length - 1]
					progress = book_data["data"]["progress"]
					activity_id = book_data["data"]["id"]

					clause = "MATCH (b:Book) WHERE book.url =~ '.*"+url_id+"' RETURN ID(b)"
					puts clause.blue.on_red
				end
			end
		rescue Exception => e
			puts e.to_s.red
		end
	end

	def get_favourite_categories
		neo = Neography::Rest.new
		match_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true}) WHERE ID(user) = " + @user_id.to_s + " RETURN "
		sort_clause = " ORDER BY likes_category.weight DESC"
		clause = match_clause + Category.get_basic_info + sort_clause
		clause
	end

	def likely_books_read
		range = self.get_book_count
		@skip_count = @skip_count.to_i > @limit ? @skip_count.to_i : Constants::InitialSkipCount  
		case range
		when Constants::ChildBookCountRange
			data = _handle_few_books_read
		when Constants::AdoloscentBookCountRange
			data = _handle_average_number_books_read
		when Constants::AboutToBeAdultBookCountRange
			data = _handle_average_number_books_read
		when Constants::AdultBookCountRange
			data = _handle_average_number_books_read
		when Constants::AboutToDieBookCountRange
			data = _handle_average_number_books_read
		end
		data
	end

	def self.create(email, password=nil, verification_token=nil)
		create_new_user = "CREATE (user:User{email:\""+email+"\", verification_token:\""+verification_token+"\", password:\""+password+"\", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, last_book: "+Constants::BestBook.to_s+", amateur: true, ask_info: true}), "
		create_feednext_relation = "(user)-[fn:FeedNext{user_id:ID(user)}]->(user), "
		create_ego_relation = "(user)-[:Ego{user_id:ID(user)}]->(user) WITH user "
		get_labels = "MATCH(bm:Label{primary_label:true}) "
		add_labels = "CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm) "
		add_categories_to_user = "WITH user MERGE (user)-[rel:Likes]-(root_category:Category{is_root:true}) ON CREATE SET rel.weight = 0 "
		# get_all_users = "MATCH (all_user:User) WHERE all_user <> user "
		# make_friends = "CREATE (user)-[:Follow]->(all_user), (user)<-[:Follow]-(all_user)"
		clause = create_new_user + create_feednext_relation + create_ego_relation + get_labels + add_labels + add_categories_to_user
		clause
	end


	def self.get_news_feed(skip_count)
		#FIXME get_news_feed_for_user
		skip_count = 0 unless skip_count.present?
		get_all_ego_relations_through_me = " OPTIONAL MATCH p=(u)-[r:Ego*..1]->(friend:User) "
		filter_relations_only_on_me = "WHERE all(r2 in relationships(p) WHERE r2.user_id="+@user_id.to_s+") WITH friend "
		get_feed_of_my_ego_friends = "MATCH (friend)-[:FeedNext*]->(feed) "
		return_data = "RETURN labels(feed), feed, feed.timestamp ORDER BY toInt(feed.timestamp) DESC SKIP "+skip_count.to_s+" LIMIT 10 "
		clause = _match_user(@user_id) + get_all_ego_relations_through_me + filter_relations_only_on_me + get_feed_of_my_ego_friends + return_data
		clause
	end

	def self.get_personal_feed(skip_count)
		skip_count = 0 unless skip_count.present?
		clause = _match_user(@user_id)+" MATCH (u)-[:FeedNext*]->(feed) RETURN labels(feed), feed, feed.timestamp ORDER BY toInt(feed.timestamp) DESC SKIP "+skip_count.to_s+" LIMIT 10 "
		clause
	end

	def self.get_notifications
		match_clause = "MATCH (u)-[r]->(n:Notification) "
		return_clause = "RETURN n, ID(n)"
		clause = _match_user(@user_id) + match_clause + return_clause
		clause
	end

	def self.get_bookmark_labels
		clause = _match_user(@user_id)+" OPTIONAL MATCH (u)-[:Labelled]->(bm:Label) RETURN bm.name, ID(bm)"
		clause
	end

	def self.get_books_bookmarked(skip_count=0)
		clause = _match_user(@user_id)+" WITH u MATCH (u)-[:Labelled]->(l:Label)-[:BookmarkedOn]->(z:BookmarkNode)-[:BookmarkAction]->(b:Book) WHERE z.user_id = "+@user_id.to_s+" RETURN b.isbn as isbn, ID(b), COLLECT(l.name) as labels SKIP "+skip_count.to_s+" LIMIT 10"
		clause
	end

	def self.get_books_from_favourite_author
		most_read_author_clause = " OPTIONAL MATCH (user)-->(:BookmarkNode)-->(read_book:Book)<-[:Wrote]-(author:Author)-[:Wrote]->(book) WHERE NOT (user)-->(:BookmarkNode)-->(book) WITH user, author, book, COUNT(DISTINCT book) AS book_count ORDER BY book_count LIMIT 1 "
		unread_books_from_author_clause = " WITH author, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s
		return_clause = " RETURN author.name AS name, ID(author) AS id, "
		clause = self.match_user(@user_id) + most_read_author_clause + unread_books_from_author_clause + return_clause + Book.get_basic_info
		clause
	end

	def self.get_books_from_most_bookmarked_era
		max_read_era_clause = " OPTIONAL MATCH (user)-->(:BookmarkNode)-->(book:Book)-[:Published_in]-(:Year)-[:FromEra]->(era:Era) WITH user, era, COUNT(book) AS books_from_era ORDER BY books_from_era DESC LIMIT 1"
		
		unread_books_from_era_clause = " MATCH (book:Book)-[:Published_in]-(:Year)-[:FromEra]->(era) WHERE NOT (user)-->(:MarkAsReadNode)-->(book) WITH era, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s 
		return_clause = " RETURN era.name AS name, ID(era) AS id, "
		clause = self.match_user(@user_id) + max_read_era_clause + unread_books_from_era_clause + return_clause + Book.get_basic_info
		clause
	end

	def self.get_books_on_friends_shelves
		friends_reads_clause = " OPTIONAL MATCH (user)-[:Follows]->(friend:User)-->(:Label{name:'CurrentlyReading'})-->(:BookmarkNode)-->(book:Book) WHERE NOT (user)-->(:MarkAsReadNode)-->(book) WITH friend, book ORDER BY book.total_weight DESC LIMIT " + Constants::RecommendationBookCount.to_s

		return_clause =  " RETURN friend.name AS name, ID(friend) AS id, "
		clause = self.match_user(@user_id) + friends_reads_clause + return_clause + Book.get_basic_info
		clause
	end

	def self.get_books_from_favourite_category(favourites = true)
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

	def self.get_friends
	end

	def self.get_books_from_favourite_category

	end

	def self.approve_thumb_request(status, id)
		clause = "MATCH (u:User)-[r1:DataEdit]->(t:ThumbRequest)-[r2:DataEditRequest]->(b:Book) WHERE ID(t)="+id.to_s+" SET t.status = "+status.to_s+", b.external_thumb = CASE WHEN "+status.to_s+" = 1 THEN t.url ELSE null END"
		clause
	end

	private
	

	def self.match_user
		clause = " MATCH (user:User) WHERE ID(user) = " + @user_id.to_s + " WITH user"
		clause
	end

	def _handle_few_books_read 
		need_rating = true
		return_clause = " RETURN "
		clause = _get_user_clause(need_rating) + return_clause +  _get_return_book_properties_clause(need_rating)

		has_linked_books = data[0]["id"].blank? ? false : true rescue false
		unless has_linked_books
			if @skip_count == 0
				match_clause = " MATCH (small_read:Book) WHERE ID(small_read) = " + Constants::BestSmallRead.to_s
			else
				match_clause = " MATCH (best_small_read_book:Book)-[:NextSmallRead*" + @skip_count.to_s + "]-(small_read) WHERE ID(best_small_read_book) = " + Constants::BestSmallRead.to_s 
			end
			match_clause += " WITH small_read MATCH initial_path = (small_read)-[:NextSmallRead*" + Constants::BookCountShownOnSignup.to_s + "]->(last_book)"
			extract_clause = " WITH EXTRACT(n in nodes(initial_path)|n) AS books UNWIND books AS book RETURN "
			order_clause = " ORDER BY popularity "

			clause =  match_clause + extract_clause + _get_return_book_properties_clause + order_clause
		end
		clause
	end

	def _get_return_book_properties_clause need_rating = false
		return_ratings_clause = ", ID(mark_as_read) AS status, rating_node.rating AS user_rating" 
		if need_rating
			clause = Book.get_basic_info + return_ratings_clause
		else 
			clause = Book.get_basic_info
		end
		clause
	end

	def _get_user_clause need_rating = false
		get_user_clause = " MATCH (user:User) WHERE ID(user) = " + @user_id.to_s + " WITH user "
		if need_rating
			get_rating_node_clause = " OPTIONAL MATCH (user:User)-[mark_as_read:MarkAsReadAction]->(:MarkAsReadNode)--(book:Book), (user)-[:RatingAction]->(rating_node:RatingNode{book_id:ID(book)}) WITH user, book, mark_as_read, rating_node"
			get_user_clause += get_rating_node_clause
		end
		get_user_clause
	end

	def self.get_book_count
		clause = " MATCH (user:User) WHERE ID(user) = " + @user_id.to_s + " RETURN user.init_book_read_count as init_book_read_count"
		range = @neo.execute_query(clause)[0]["init_book_read_count"]
		range
	end

	def _handle_average_number_books_read
	 	need_rating = true
	 	match_book_genre_clause = " MATCH (book)-[:FromCategory]->(:Category)-[HasRoot*0..1]->(root_category{is_root:true}) WITH book, mark_as_read, root_category, rating_node  ORDER BY book.total_weight DESC SKIP " + @skip_count.to_s + " LIMIT " + Constants::BookCountShownOnSignup.to_s + " RETURN root_category.name as name, ID(root_category) as category_id, root_category.icon as icon, root_category.aws_key as key, "
	 	clause =  _get_user_clause(need_rating) + match_book_genre_clause + _get_return_book_properties_clause(need_rating) 
	 	data = @neo.execute_query clause
	 	has_linked_books = data[0]["root_category"].blank? ? false : true rescue false
	 	
	 	unless has_linked_books
	 		find_genre_clause = "  MATCH (user:User)-[likes_category:Likes]->(root_category{is_root:true}) WHERE ALL(relation IN likes_category WHERE relation.weight > 0 ) WITH root_category, root_category.uuid AS root_uuid "
			get_linked_books_clause = "  MATCH initial_path = (root_category)-[:NextInCategory*" + (@skip_count.to_i + Constants::BookCountShownOnSignup.to_i).to_s + "]->(small_reads) WHERE ALL(relation IN relationships(initial_path) WHERE relation.from_category = root_uuid) "
			extract_books_from_list_clause = " WITH root_category, EXTRACT(n in nodes(initial_path)|n) AS books UNWIND books AS book WITH book, root_category ORDER BY book.total_weight DESC SKIP " + @skip_count.to_s + " LIMIT " + Constants::BookCountShownOnSignup.to_s 
			return_clause = " RETURN root_category.name as name, ID(root_category) as category_id, root_category.icon as icon, root_category.aws_key as key,  "
	 		clause = _get_user_clause + find_genre_clause + get_linked_books_clause + extract_books_from_list_clause + return_clause + _get_return_book_properties_clause 
	 		data = @neo.execute_query clause
	 	end
	 	data
	end
end