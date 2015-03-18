module UsersGraphHelper

	def self.neo_init
		@neo = Neography::Rest.new
	end


	def self.rate_book(user_id, book_id, rating)
		@neo ||= self.neo_init

		rating_clause = _match_user_and_book(user_id, book_id)+" CREATE UNIQUE (u)-[:RatingAction]->(m:RatingNode{book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+user_id.to_s+"})-[:Rate]->(b) SET m.rating="+rating.to_s+", m.timestamp="+Time.now.to_i.to_s+", m.name=u.name, m.email=u.email, m.isbn=b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m "

		set_clause = "SET b.rating_count = CASE WHEN b.rating_count IS NULL THEN 1 ELSE toInt(b.rating_count) + 1 END, u.rating_count = CASE WHEN u.rating_count IS NULL THEN 1 ELSE toInt(u.rating_count) + 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::RatingPoints.to_s+" ELSE toInt(u.total_count) + "+Constants::RatingPoints.to_s+" END"

		clause = rating_clause + _delete_existing_feednext_clause(user_id) + _feednext_clause(user_id) + _bookfeed_clause(user_id) + _existing_ego_clause + _ego_clause + set_clause
		puts "RATE".green
		puts clause.blue.on_red
		@neo.execute_query clause
		#update mark as read cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update mark as read cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end


	def self.endorse_book book_id, user_id
		@neo ||= self.neo_init
<<<<<<< HEAD
		create_endorse_node_clause = _match_user_and_book(user_id, book_id) + " WITH u AS user, b AS book MERGE (user)-[:EndorseAction]->(endorsed:EndorseNode{created_at: " + Time.now.to_i.to_s + ", book_id:ID(book), user_id:ID(user), updated_at:  " + Time.now.to_i.to_s + "})-[endorsed:Endorsed]->(book:Book) WITH user, endorsed, book"
		find_old_feed_clause = " MATCH (user)-[old:FeedNext]->(old_feed)  "
		create_new_feed_clause = " MERGE (user)-[:FeedNext{user_id:" + user_id.to_s + "}]->(endorsed)-[:FeedNext{user_id:" + user_id.to_s + "}]->(old_feed) DELETE old WITH user, endorsed, book"
		find_old_book_feed_clause = " MATCH (book)-[old:BookFeed{book_id:" + book_id.to_s + "}]->(old_feed) "
		create_new_book_feed_clause = " MERGE (book)-[:BookFeed{book_id:" + book_id.to_s + "}]->(endorsed)-[:BookFeed{book_id:" + book_id.to_s + "}]->(old_feed) DELETE old WITH user AS u"
=======
		create_endorse_node_clause = _match_user_and_book(user_id, book_id) + " WITH u AS user, b AS book MERGE (user)-[:EndorsingAction]-(endorsed:EndorsedNode{created_at: " + Time.now.to_i.to_s + ", book_id:ID(book), user_id:ID(user), updated_at:  " + Time.now.to_i.to_s + "})-[endorsed:Endorsed]-(book:Book) WITH user, endorsed, book"
		find_old_feed_clause = " MATCH (user)-[old:FeedNext]->(old_feed)  "
		create_new_feed_clause = " MERGE (user)-[:FeedNext{user_id:" + user_id.to_s + "}]->(endorsed)-[:FeedNext{user_id:" + user_id.to_s + "}]->(old_feed) DELETE old WITH user, endorsed, book"
		find_old_book_feed_clause = " MATCH (book)-[old:BookFeed]->(old_feed) "
		create_new_book_feed_clause = " MERGE (book)-[:BookFeed{user_id:" + user_id.to_s + "}]->(endorsed)-[:BookFeed{user_id:" + user_id.to_s + "}]->(old_feed) DELETE old WITH user AS u"
>>>>>>> 80cc2f983588194ec2750c6f7c9bc1857cfc4fbe

		existing_ego_clause = _existing_ego_clause

		ego_clause = _ego_clause 

		clause = create_endorse_node_clause + find_old_feed_clause + create_new_feed_clause + find_old_book_feed_clause + create_new_book_feed_clause + existing_ego_clause + ego_clause 
		@neo.execute_query(clause)
	end

<<<<<<< HEAD
	def self.remove_endorse endorse_id, user_id
		@neo ||= self.neo_init
		get_endorse_user_clause = " MATCH (endorse:EndorseNode), (user:User) WHERE ID(endorse) = " + endorse_id.to_s + " AND ID(user) = " + user_id.to_s + " WITH endorse, user "
		resolve_user_feed_clause = " OPTIONAL MATCH (user)-[endorse_action:EndorseAction]->(endorse)-[endorsed:Endorsed]->(book:Book), (newer_user_feed)-[incoming_user_feed:FeedNext]->(endorsed)-[outgoing_user_feed:FeedNext]->(older_user_feed) DELETE endorsed, endorse_action, incoming_user_feed, outgoing_user_feed WITH newer_user_feed, older_user_feed, endorse MERGE (newer_user_feed)-[:FeedNext{user_id: " + user_id.to_s + "}]->(older_user_feed) WITH endorse"
		resolve_book_feed_clause = "OPTIONAL MATCH (newer_book_feed)-[incoming_book_feed:BookFeed]->(endorsed)-[outgoing_book_feed:BookFeed]->(older_book_feed) WITH incoming_book_feed.book_id AS book_id, newer_book_feed, older_book_feed, incoming_book_feed, outgoing_book_feed MERGE (newer_book_feed)-[:BookFeed{book_id:book_id}]->(older_book_feed) DELETE incoming_book_feed, outgoing_book_feed WITH endorse "
		resolve_other_relations = " OPTIONAL MATCH (node)-[relation]-(endorse) DELETE relation, endorse"
		clause = get_endorse_user_clause + resolve_user_feed_clause + resolve_book_feed_clause + resolve_other_relations
		@neo.execute_query clause
	end

=======
>>>>>>> 80cc2f983588194ec2750c6f7c9bc1857cfc4fbe
	def self.record_time(user_id, book_id, time)
		@neo ||= self.neo_init
		rating_clause = _match_user_and_book(user_id, book_id)+" CREATE UNIQUE (u)-[:TimingAction]->(m:TimingNode{book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+user_id.to_s+"})-[:Timer]->(b) SET m.timestamp="+Time.now.to_i.to_s+", m.time_index="+time.to_s+", m.name=u.name, m.email=u.email, m.isbn=b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END  WITH u, b, m "

		set_clause = "SET u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::ReadTimePoints.to_s+" ELSE toInt(u.total_count) + "+Constants::ReadTimePoints.to_s+" END"

		clause = rating_clause + _delete_existing_feednext_clause(user_id) + _feednext_clause(user_id) + _bookfeed_clause(user_id) + _existing_ego_clause + _ego_clause + set_clause
		puts "TIMER".green
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	# ************************************************

	# MATCH (u:User)
	# WHERE ID(u) = USER_ID
	# OPTIONAL MATCH (u)-[:BookmarkAction{user_id:USER_ID}]->(bm:Label)
	# RETURN bm.name

	# ************************************************
	def self.get_bookmark_labels user_id
		@neo ||= self.neo_init
		clause = _match_user(user_id)+" OPTIONAL MATCH (u)-[:Labelled]->(bm:Label) RETURN bm.name, ID(bm)"
		puts clause.blue.on_red
		@neo.execute_query(clause)["data"]
	end

	def self.get_books_read(user_id, skip_count=0)
		@neo ||= self.neo_init
		clause = "MATCH (u:User)-[:MarkAsReadAction]->(m:MarkAsReadNode)-[:MarkAsRead]->(b:Book) WHERE ID(u)="+user_id.to_s+" RETURN b.isbn as isbn, ID(b), m.timestamp as timestamp ORDER BY timestamp SKIP "+skip_count.to_s+" LIMIT 10"
		puts clause.blue.on_red
		@neo.execute_query(clause)["data"]
	end

	def self.get_books_bookmarked(user_id, skip_count=0)
		@neo ||= self.neo_init
		clause = _match_user(user_id)+" WITH u MATCH (u)-[:Labelled]->(l:Label)-[:BookmarkedOn]->(z:BookmarkNode)-[:BookmarkAction]->(b:Book) WHERE z.user_id = "+user_id.to_s+" RETURN b.isbn as isbn, ID(b), COLLECT(l.name) as labels SKIP "+skip_count.to_s+" LIMIT 10"

		puts clause.blue.on_red
		@neo.execute_query(clause)["data"]
	end


	def self.bookmark_book(user_id, book_id, bookmark_name)
		#FIXME: bookmark book
		@neo ||= self.neo_init
		bookmark_clause = _match_user_and_book(user_id, book_id)+" CREATE UNIQUE (u)-[lr:Labelled]->(l:Label{name: \""+bookmark_name.strip.upcase+"\"}), (l)-[:BookmarkedOn]->(m: BookmarkNode{label:\""+bookmark_name.strip.upcase+"\", book_id:"+book_id.to_s+", user_id:"+user_id.to_s+"}), (m)-[:BookmarkAction]->(b) SET m.title = b.title,  m.author = b.author_name, m.name = u.name, m.email=u.email, m.isbn = b.isbn, m.timestamp = "+Time.now.to_i.to_s+", m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m, l, lr "

		feednext_clause = _feednext_clause(user_id)+", l, lr "

		bookfeed_next_clause = _bookfeed_clause(user_id)+", l, lr "

		existing_ego_clause = _existing_ego_clause+", l, lr "

		ego_clause = _ego_clause + ", l, lr "


		set_clause = "SET b.bookmark_count = CASE WHEN b.bookmark_count IS NULL THEN 1 ELSE toInt(b.bookmark_count) + 1 END, u.bookmark_count = CASE WHEN u.bookmark_count IS NULL THEN 1 ELSE toInt(u.bookmark_count) + 1 END, l.bookmark_count = CASE WHEN l.bookmark_count IS NULL THEN 1 ELSE toInt(l.bookmark_count) + 1 END, lr.bookmark_count = CASE WHEN lr.bookmark_count IS NULL THEN 1 ELSE toInt(lr.bookmark_count) + 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::BookmarkPoints.to_s+" ELSE toInt(u.total_count) + "+Constants::BookmarkPoints.to_s+" END"

		clause = bookmark_clause + feednext_clause + bookfeed_next_clause + existing_ego_clause + ego_clause + set_clause
		puts clause.blue.on_red
		puts "BOOK BOOKMARKED".green
		@neo.execute_query(clause)
		#update bookmark cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookmark cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.remove_bookmark(user_id, book_id, bookmark_name)
		#FIXME: remove_bookmark
		@neo ||= self.neo_init
		remove_bookmark_node_clause = "MATCH (u:User), (b:Book), (l:Label) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" AND l.name = \""+bookmark_name.strip.upcase+"\" WITH u, b, l MATCH (u)-[lr:Labelled]->(l)-[r1:BookmarkedOn]->(m:BookmarkNode)-[r3:BookmarkAction]->(b) DELETE r1, r3 WITH u, b, lr, l, m "
		
		feednext_clause = _delete_feed_clause(user_id) + ", lr, l "

		bookfeed_next_clause = _delete_book_clause(user_id) + ", lr, l "

		delete_node = "DELETE m WITH u, b, l, lr "

		set_clause = "SET b.bookmark_count = CASE WHEN b.bookmark_count IS NULL THEN 0 ELSE toInt(b.bookmark_count) - 1 END, u.bookmark_count = CASE WHEN u.bookmark_count IS NULL THEN 0 ELSE toInt(u.bookmark_count) - 1 END, l.bookmark_count = CASE WHEN l.bookmark_count IS NULL THEN 0 ELSE toInt(l.bookmark_count) - 1 END, lr.bookmark_count = CASE WHEN lr.bookmark_count IS NULL THEN 0 ELSE toInt(lr.bookmark_count) - 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN 0 ELSE toInt(u.total_count) - "+Constants::BookmarkPoints.to_s+" END"

		clause = remove_bookmark_node_clause + feednext_clause + bookfeed_next_clause + delete_node + set_clause

		puts clause.blue.on_red
		puts "REMOVE BOOKMARKED".green
		@neo.execute_query(clause)
		
		#ego feed update
		#update bookmark cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookmark cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.mark_as_read(user_id, book_id)
		#FIXME mark_as_read
		@neo ||= self.neo_init
		# clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" OPTIONAL MATCH (b)-[:Belongs_to]->(:Category)-[r:Has_root]->(c:Category), (u)-[fr:FeedNext]->(top_feed), (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user) WHERE fr.user_id="+user_id.to_s+" CREATE (u)-[:MarkAsReadAction]->(m:MarkAsReadNode{timestamp:"+Time.now.to_i.to_s+"})-[:MarkAsRead]->(b) MERGE (c)<-[ur:Tendency_for]-(u) ON CREATE SET ur.weight = r.weight ON MATCH SET ur.weight = ur.weight + r.weight CREATE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[:FeedNext{user_id:"+user_id.to_s+"}]->(top_feed) CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user) DELETE fr, ego SET b.readers_count = b.readers_count + 1 SET u.book_read_count = u.book_read_count + 1"
		
		mark_as_read_clause = _match_user_and_book(user_id, book_id)+" CREATE UNIQUE (u)-[:MarkAsReadAction]->(m:MarkAsReadNode{timestamp:"+Time.now.to_i.to_s+", book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+user_id.to_s+"})-[:MarkAsRead]->(b) SET m.name = u.name, m.email=u.email, m.isbn = b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m "

		set_clause = "SET b.readers_count = CASE WHEN b.readers_count IS NULL THEN 1 ELSE toInt(b.readers_count) + 1 END, u.book_read_count = CASE WHEN u.book_read_count IS NULL THEN 1 ELSE toInt(u.book_read_count) + 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::MarkAsReadPoints.to_s+" ELSE toInt(u.total_count) + "+Constants::MarkAsReadPoints.to_s+" END"

		clause = mark_as_read_clause + _feednext_clause(user_id) + _bookfeed_clause(user_id) + _existing_ego_clause + _ego_clause + set_clause
		puts "MARK AS READ".green
		puts clause.blue.on_red
		@neo.execute_query clause
		#update mark as read cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update mark as read cache for the user
		#update bookworm index for the user
	end


	def self.mark_as_unread(user_id, book_id)
		#FIXME mark_as_unread
		@neo ||= self.neo_init
		# clause = "MATCH (u:User)-[r1:MarkAsReadAction]->(m:MarkAsReadNode)-[r2:MarkAsRead]->(b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" OPTIONAL MATCH (b)-[:Belongs_to]->(:Category)-[r:Has_root]->(c:Category), (c)<-[r3:Tendency_for]-(u), (s)-[f1:FeedNext]->(m)-[f2:FeedNext]->(e) CREATE (s)-[:FeedNext]->(e) SET r3.weight = r3.weight - r.weight SET b.readers_count = b.readers_count - 1 SET u.book_read_count = u.book_read_count - 1 DELETE m, r1, r2, f1, f2"
		# delete mark as read relation
		mark_as_unread_clause = _match_user_and_book(user_id, book_id)+" WITH u, b MATCH (u)-[r1:MarkAsReadAction]->(m:MarkAsReadNode)-[r2:MarkAsRead]->(b) DELETE r1, r2 WITH u, b, m "

		# delete rating action
		rating_clause = _removing_rating + ", rn "

		#delete timing action
		timing_clause =_remove_timing + ", rn, tn "

		#delete feed relation
		feednext_clause = _delete_feed_clause(user_id) + ", rn, tn "

		#delete rating feed
		rating_feed_clause = _delete_feed_clause(user_id, "rn") + ", rn, tn "

		#delete timing node feed
		timing_feed_clause = _delete_feed_clause(user_id, "tn") + ", rn, tn "

		#delete book feed relation
		bookfeed_clause = _delete_book_clause(user_id) + ", rn, tn "

		rating_bookfeed_clause = _delete_book_clause(user_id, "rn") + ", rn, tn "

		timing_node_bookfeed_clause = _delete_book_clause(user_id, "tn") + ", rn, tn "

		delete_node = " DELETE m, rn, tn WITH u, b "

		# ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) WITH u, b, f OPTIONAL MATCH (f)-[old:Ego]->(old_ego) WHERE old_ego <> u FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH u, b "

		#update book and user properties
		book_readers_count = "SET b.readers_count = CASE WHEN b.readers_count IS NULL THEN 0 ELSE toInt(b.readers_count) - 1 END, "
		user_book_read_count = "u.book_read_count = CASE WHEN u.book_read_count IS NULL THEN 0 ELSE toInt(u.book_read_count) - 1 END, "
		user_total_count = "u.total_count = CASE WHEN u.total_count IS NULL THEN 0 ELSE toInt(u.total_count) - "+Constants::MarkAsReadPoints.to_s+" END"

		clause = mark_as_unread_clause + rating_clause + timing_clause + feednext_clause + rating_feed_clause + timing_feed_clause + bookfeed_clause + rating_bookfeed_clause + timing_node_bookfeed_clause + delete_node + book_readers_count + user_book_read_count + user_total_count
		# WHERE r3.weight = 0 DELETE r3
		puts clause.blue.on_red
		puts "MARK AS UNREAD".green
		@neo.execute_query(clause)
	end

	def self.create_user(email, password=nil, verification_token=nil)
		@neo ||= self.neo_init
		create_new_user = "CREATE (user:User{email:\""+email+"\", verification_token:\""+verification_token+"\", password:\""+password+"\", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, last_book: "+Constants::BestBook.to_s+", amateur: true, ask_info: true}), "
		create_feednext_relation = "(user)-[fn:FeedNext{user_id:ID(user)}]->(user), "
		create_ego_relation = "(user)-[:Ego{user_id:ID(user)}]->(user) WITH user "
		get_labels = "MATCH(bm:Label{primary_label:true}) "
		add_labels = "CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm) "
		add_categories_to_user = "WITH user MERGE (user)-[rel:Likes]-(root_category:Category{is_root:true}) ON CREATE SET rel.weight = 0 "
		# get_all_users = "MATCH (all_user:User) WHERE all_user <> user "
		# make_friends = "CREATE (user)-[:Follow]->(all_user), (user)<-[:Follow]-(all_user)"
		clause = create_new_user + create_feednext_relation + create_ego_relation + get_labels + add_labels + add_categories_to_user
		puts clause.blue.on_red
		@neo.execute_query(clause)
	end

	# MATCH (u:User)-[:FeedNext*0..]->(news_feed)
	# WHERE (ID)=USER_ID
	# RETURN news_feed
	def self.get_news_feed(user_id, skip_count)
		#FIXME get_news_feed_for_user
		@neo ||= self.neo_init
		skip_count = 0 unless skip_count.present?
		get_all_ego_relations_through_me = " OPTIONAL MATCH p=(u)-[r:Ego*..1]->(friend:User) "
		filter_relations_only_on_me = "WHERE all(r2 in relationships(p) WHERE r2.user_id="+user_id.to_s+") WITH friend "
		get_feed_of_my_ego_friends = "MATCH (friend)-[:FeedNext*]->(feed) "
		return_data = "RETURN labels(feed), feed, feed.timestamp ORDER BY toInt(feed.timestamp) DESC SKIP "+skip_count.to_s+" LIMIT 10 "
		clause = _match_user(user_id) + get_all_ego_relations_through_me + filter_relations_only_on_me + get_feed_of_my_ego_friends + return_data
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	def self.get_personal_feed(user_id, skip_count)
		@neo ||= self.neo_init
		skip_count = 0 unless skip_count.present?
		clause = _match_user(user_id)+" MATCH (u)-[:FeedNext*]->(feed) RETURN labels(feed), feed, feed.timestamp ORDER BY toInt(feed.timestamp) DESC SKIP "+skip_count.to_s+" LIMIT 10 "
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	# ************************************************
	
	# MATCH (u:User)-[:FeedNext]->(news_feed)
	# WHERE (ID)=USER_ID
	# RETURN labels(news_feed), news_feed

	# ************************************************
	def self.get_latest_news_feed user_id
		
	end

	# ************************************************

	# MATCH (u:User)-[r]-() DELETE u, r 
	# MATCH (u:MarkAsReadNode)-[r]-() DELETE u, r
	def self.delete_user
		@neo ||= self.neo_init
		user_delete_clause = "MATCH (u:User)-[r]-() DELETE u, r "
		mark_as_read_delete_clause = "MATCH (u:MarkAsReadNode)-[r]-() DELETE u, r"
		clause = user_delete_clause + mark_as_read_delete_clause
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	
	def self.comment_on_book(user_id, book_id, tweet)
		@neo ||= self.neo_init
		if book_id
			tweet_clause = _match_user_and_book(user_id, book_id)+" CREATE UNIQUE (u)-[:Commented]->(m:Tweet{tweet:\""+tweet[:message]+"\", timestamp:"+Time.now.to_i.to_s+", book_id: "+book_id.to_s+", title: b.title, author_name: b.author_name, user_id: "+user_id.to_s+", label1:\""+tweet[:label1]+"\", label2:\""+tweet[:label2]+"\", icon:\""+tweet[:icon]+"\"})-[:CommentedOn]->(b) SET m.isbn=b.isbn, m.name=u.name, m.email=u.email, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m "
			with_clause = ", b "
			bookfeed_clause = _bookfeed_clause(user_id)
			set_clause = ", b.comment_count = CASE WHEN b.comment_count IS NULL THEN 1 ELSE toInt(b.comment_count) + 1 END"
		else
			tweet_clause = _match_user(user_id)+" CREATE UNIQUE (u)-[:Commented]->(m:Tweet{tweet:\""+tweet[:message]+"\", timestamp:"+Time.now.to_i.to_s+", user_id: "+user_id.to_s+", label1:\""+tweet[:label1]+"\", label2:\""+tweet[:label2]+"\", icon:\""+tweet[:icon]+"\"}) SET m.name=u.name, m.email=u.email, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, m "
			with_clause = " "
			bookfeed_clause = " "
			set_clause = " "
		end

		
		feednext_clause = _feednext_clause(user_id, true)+with_clause
		
		existing_ego_clause = _existing_ego_clause(true)+with_clause

		ego_clause = _ego_clause(true)+with_clause

		set_clause = "SET u.comment_count = CASE WHEN u.comment_count IS NULL THEN 1 ELSE toInt(u.comment_count) + 1 END" + set_clause
		
		clause = tweet_clause + feednext_clause + bookfeed_clause + existing_ego_clause + ego_clause + set_clause
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	def self.recommend_book(user_id, friend_id, book_id)
		@neo || self.neo_init
		total_count = "SET u.total_count = CASE WHEN u.total_count IS NULL THEN 1 ELSE u.total_count + "+Constants::RecommendationPoints.to_s+" END "
		recommended_count = "SET b.recommended_count = CASE WHEN b.recommended_count IS NULL THEN 1 ELSE toInt(b.recommended_count) + 1 END"

		clause = _recommend_clause(user_id, book_id, friend_id) + _feednext_clause(user_id) + _bookfeed_clause(user_id) + _existing_ego_clause + _ego_clause + total_count + recommended_count
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	def self.get_notifications user_id
		@neo || self.neo_init
		match_clause = "MATCH (u)-[r]->(n:Notification) "
		return_clause = "RETURN n, ID(n)"
		clause = _match_user(user_id) + match_clause + return_clause
		puts clause.blue.on_red
		info = @neo.execute_query(clause)["data"]
	end

	def self.follow_user(user_id, friend_id)
		@neo || self.neo_init
		match_clause = "MATCH (u:User), (f:User) WHERE ID(u)="+user_id.to_s+" AND ID(f)="+friend_id.to_s+" "

		ego_clause = " MATCH (u)-[old:Ego{user_id:ID(u)}]->(old_ego) CREATE (u)-[:Ego{user_id:ID(u)}]->(f)-[:Ego{user_id:ID(u)}]->(old_ego) DELETE old WITH u, f "

		follow_clause = "CREATE UNIQUE (u)-[r:Follow]->(f) SET r.timestamp = "+Time.now.to_i.to_s

		clause = match_clause + ego_clause + follow_clause
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	def self.unfollow_user(user_id, friend_id)
		@neo || self.neo_init
		match_clause = "MATCH (u:User), (f:User) WHERE ID(u)="+user_id.to_s+" AND ID(f)="+friend_id.to_s+" "

		existing_ego_clause = "MATCH (x1)-[r1:Ego{user_id:ID(u)}]->(f)-[r2:Ego{user_id:ID(u)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(u)}]->(x2) DELETE s, t)) WITH u, f "

		unfollow_clause = "MATCH (u)-[r:Follow]->(f) DELETE r "

		clause = match_clause + existing_ego_clause + unfollow_clause
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	private
	def _match_user(user_id)
		"MATCH (u:User) WHERE ID(u)="+user_id.to_s+" "
	end

	def _match_user_and_book(user_id, book_id)
		"MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" "
	end

	def _recommend_clause(user_id, book_id, friend_id)
		match_clause = "MATCH (u:User), (b:Book), (friend:User) "
		where_clause = "WHERE ID(u)="+user_id.to_s+
						" AND ID(b)="+book_id.to_s+
						" AND ID(friend)="+friend_id.to_s+" "
		create_clause = "CREATE UNIQUE (u)-[:RecommendedTo]->(friend)-[:RecommendedAction]->(m:RecommendNode{book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+user_id.to_s+", friend_id:"+friend_id.to_s+", timestamp:"+Time.now.to_i.to_s+", email:u.email, friend_email:friend.email})-[:Recommended]->(b) "
		set_notification_label = "SET m :Notification "
		set_clause = "SET m.name=u.name, m.friend_name=friend.name, m.isbn=b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m "
		clause = match_clause + where_clause + create_clause + set_notification_label + set_clause
		clause
	end

	def _delete_existing_feednext_clause user_id
		match_clause = "OPTIONAL MATCH (x)-[r1:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[r2:FeedNext{user_id:"+user_id.to_s+"}]->(y) "
		delete_clause = "FOREACH (a IN CASE WHEN x IS NULL THEN [] ELSE [x] END | FOREACH (b IN CASE WHEN y IS NULL THEN [] ELSE [y] END |	CREATE  (a)-[:FeedNext{user_id:"+user_id.to_s+"}]->(b) DELETE r1, r2)) "
		with_clause = "WITH u, b, m "
		clause = match_clause + delete_clause + with_clause
		clause
	end

	def _feednext_clause(user_id, without_book=false)
		find_old_feed = "MATCH (u)-[old:FeedNext]->(old_feed) "
		create_new_feed = "CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[:FeedNext{user_id:"+user_id.to_s+"}]->(old_feed) "
		if without_book
			delete_old_feed = "DELETE old WITH u, m "
		else
			delete_old_feed = "DELETE old WITH u, b, m "
		end
		clause = find_old_feed + create_new_feed + delete_old_feed
		clause
	end

	def _bookfeed_clause user_id
		find_old_book_feed = "MATCH (b)-[old:BookFeed]->(old_feed) "
		create_new_book_feed = "CREATE UNIQUE (b)-[:BookFeed{user_id:"+user_id.to_s+"}]->(m)-[:BookFeed{user_id:"+user_id.to_s+"}]->(old_feed) "
		delete_old_book_feed = "DELETE old WITH u, b, m "
		clause = find_old_book_feed + create_new_book_feed + delete_old_book_feed
		clause
	end

	def _existing_ego_clause(without_book=false)
		find_friends = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) "
		find_me_in_friends_ego_chain = "OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) "
		remove_me_from_friends_ego_chain = "FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) DELETE s, t)) "
		if without_book
			with_clause = "WITH u, f "
		else
			with_clause = "WITH u, b, f "
		end
		clause = find_friends + find_me_in_friends_ego_chain + remove_me_from_friends_ego_chain + with_clause
		clause
	end

	def _ego_clause(without_book=false)
		friends_old_ego_clause = "OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) "
		create_new_and_delete_old_ego_clause = "FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) "
		if without_book
			with_clause = "WITH DISTINCT u "
		else
			with_clause = "WITH DISTINCT u, b "
		end
		clause = friends_old_ego_clause + create_new_and_delete_old_ego_clause + with_clause
		clause
	end

	def _delete_feed_clause(user_id, other_label=nil)
		if other_label
			get_feed_relations_for_m = "MATCH (s)-[f1:FeedNext{user_id:"+user_id.to_s+"}]->("+other_label+")-[f2:FeedNext{user_id:"+user_id.to_s+"}]->(e) "
		else
			get_feed_relations_for_m = "MATCH (s)-[f1:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[f2:FeedNext{user_id:"+user_id.to_s+"}]->(e) "
		end
		create_new_relations_in_place = "CREATE (s)-[:FeedNext{user_id:"+user_id.to_s+"}]->(e) "
		delete_old_relations = "DELETE f1, f2 "
		with_clause = "WITH u, b, m "
		clause = get_feed_relations_for_m + create_new_relations_in_place + delete_old_relations + with_clause
		clause
	end

	def _delete_book_clause(user_id, other_label=nil)
		if other_label
			get_bookfeed_relations_for_m = "MATCH (s)-[b1:BookFeed{user_id:"+user_id.to_s+"}]->("+other_label+")-[b2:BookFeed{user_id:"+user_id.to_s+"}]->(e) "
		else
			get_bookfeed_relations_for_m = "MATCH (s)-[b1:BookFeed{user_id:"+user_id.to_s+"}]->(m)-[b2:BookFeed{user_id:"+user_id.to_s+"}]->(e) "
		end
		create_new_relations_in_place = "CREATE (s)-[:BookFeed{user_id:"+user_id.to_s+"}]->(e) "
		delete_old_relations = "DELETE b1, b2 "
		with_clause = "WITH u, b, m"
		clause = get_bookfeed_relations_for_m + create_new_relations_in_place + delete_old_relations + with_clause
		clause
	end

	def _removing_rating
		get_rating_relationship = "OPTIONAL MATCH (u)-[r1:RatingAction]->(rn:RatingNode)-[r2:Rate]->(b) "
		delete_rating_relationship = "FOREACH (p IN CASE WHEN r1 IS NULL THEN [] ELSE [u] END | FOREACH (q IN CASE WHEN r2 IS NULL THEN [] ELSE [b] END | SET q.rating_count = CASE WHEN q.rating_count IS NULL THEN 0 ELSE toInt(q.rating_count) - 1 END,  p.total_count = CASE WHEN p.total_count IS NULL THEN 0 ELSE toInt(p.total_count) - "+Constants::RatingPoints.to_s+" END, p.rating_count = CASE WHEN p.rating_count IS NULL THEN 0 ELSE toInt(p.rating_count) - 1 END DELETE r1, r2))  "
		with_clause = "WITH u, b, m"
		clause = get_rating_relationship + delete_rating_relationship + with_clause
		clause
	end

	def _remove_timing
		get_timing_relationship = "OPTIONAL MATCH (u)-[r1:TimingAction]->(tn:TimingNode)-[r2:Timer]->(b) "
		delete_timing_relationship = "FOREACH (p IN CASE WHEN r1 IS NULL THEN [] ELSE [u] END | FOREACH (q IN CASE WHEN r2 IS NULL THEN [] ELSE [b] END | SET p.total_count = CASE WHEN p.total_count IS NULL THEN 0 ELSE toInt(p.total_count) - "+Constants::ReadTimePoints.to_s+" END DELETE r1, r2)) "
		with_clause = "WITH u, b, m "
		clause = get_timing_relationship + delete_timing_relationship + with_clause
		clause
	end

end