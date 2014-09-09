module UsersGraphHelper

	def self.neo_init
		@neo = Neography::Rest.new
	end


	def self.rate_book(user_id, book_id, rating)
		@neo ||= self.neo_init

		rating_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" CREATE UNIQUE (u)-[:RatingAction]->(m:RatingNode{book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+user_id.to_s+"})-[:Rate]->(b) SET m.rating="+rating.to_s+", m.timestamp="+Time.now.to_i.to_s+", m.name=u.name, m.email=u.email, m.isbn=b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m "

		delete_existing_feednext_clause = "OPTIONAL MATCH (x)-[r1:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[r2:FeedNext{user_id:"+user_id.to_s+"}]->(y) FOREACH (a IN CASE WHEN x IS NULL THEN [] ELSE [x] END | FOREACH (b IN CASE WHEN y IS NULL THEN [] ELSE [y] END |	CREATE  (a)-[:FeedNext{user_id:"+user_id.to_s+"}]->(b) DELETE r1, r2)) WITH u, b, m "

		feednext_clause = "MATCH (u)-[old:FeedNext]->(old_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[:FeedNext{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, m "

		bookfeed_clause = "MATCH (b)-[old:BookFeed]->(old_feed) CREATE UNIQUE (b)-[:BookFeed{user_id:"+user_id.to_s+"}]->(m)-[:BookFeed{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, m "

		existing_ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) DELETE s, t)) WITH u, b, f "

		ego_clause = "OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH DISTINCT u, b "


		set_clause = "SET b.rating_count = CASE WHEN b.rating_count IS NULL THEN 1 ELSE toInt(b.rating_count) + 1 END, u.rating_count = CASE WHEN u.rating_count IS NULL THEN 1 ELSE toInt(u.rating_count) + 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::RatingPoints.to_s+" ELSE toInt(u.total_count) + "+Constants::RatingPoints.to_s+" END"

		clause = rating_clause + delete_existing_feednext_clause + feednext_clause + bookfeed_clause + existing_ego_clause + ego_clause + set_clause
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

	def self.record_time(user_id, book_id, time)
		@neo ||= self.neo_init
		rating_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" CREATE UNIQUE (u)-[:TimingAction]->(m:TimingNode{book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+user_id.to_s+"})-[:Timer]->(b) SET m.timestamp="+Time.now.to_i.to_s+", m.time_index="+time.to_s+", m.name=u.name, m.email=u.email, m.isbn=b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END  WITH u, b, m "

		delete_existing_feednext_clause = "OPTIONAL MATCH (x)-[r1:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[r2:FeedNext{user_id:"+user_id.to_s+"}]->(y) FOREACH (a IN CASE WHEN x IS NULL THEN [] ELSE [x] END | FOREACH (b IN CASE WHEN y IS NULL THEN [] ELSE [y] END |	CREATE  (a)-[:FeedNext{user_id:"+user_id.to_s+"}]->(b) DELETE r1, r2)) WITH u, b, m "

		feednext_clause = "MATCH (u)-[old:FeedNext]->(old_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[:FeedNext{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, m "

		bookfeed_clause = "MATCH (b)-[old:BookFeed]->(old_feed) CREATE UNIQUE (b)-[:BookFeed{user_id:"+user_id.to_s+"}]->(m)-[:BookFeed{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, m "

		existing_ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) DELETE s, t)) WITH u, b, f "

		ego_clause = "OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH DISTINCT u, b "


		set_clause = "SET u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::ReadTimePoints.to_s+" ELSE toInt(u.total_count) + "+Constants::ReadTimePoints.to_s+" END"

		clause = rating_clause + delete_existing_feednext_clause + feednext_clause + bookfeed_clause + existing_ego_clause + ego_clause + set_clause
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
		clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" OPTIONAL MATCH (u)-[:Labelled]->(bm:Label) RETURN bm.name, ID(bm)"
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
		clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" WITH u MATCH (u)-[:Labelled]->(l:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(b:Book) RETURN b.isbn as isbn, ID(b), COLLECT(l.name) as labels SKIP "+skip_count.to_s+" LIMIT 10"

		puts clause.blue.on_red
		@neo.execute_query(clause)["data"]
	end


	def self.bookmark_book(user_id, book_id, bookmark_name)
		#FIXME: bookmark book
		@neo ||= self.neo_init
		bookmark_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" CREATE UNIQUE (u)-[lr:Labelled]->(l:Label{name: \""+bookmark_name.strip.upcase+"\"}), (l)-[:BookmarkedOn]->(bm: BookmarkNode{label:\""+bookmark_name.strip.upcase+"\", book_id:"+book_id.to_s+", user_id:"+user_id.to_s+"}), (bm)-[:BookmarkAction]->(b) SET bm.title = b.title,  bm.author = b.author_name, bm.name = u.name, bm.email=u.email, bm.isbn = b.isbn, bm.timestamp = "+Time.now.to_i.to_s+", bm.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, bm, l, lr "

		feednext_clause = "MATCH (u)-[old:FeedNext]->(type_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(bm)-[:FeedNext{user_id:"+user_id.to_s+"}]->(type_feed) DELETE old WITH u, b, bm, l, lr "

		bookfeed_next_clause = "MATCH (b)-[old:BookFeed]->(old_feed) CREATE UNIQUE (b)-[:BookFeed{user_id:"+user_id.to_s+"}]->(bm)-[:BookFeed{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, bm, l, lr "

		existing_ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) DELETE s, t)) WITH u, b, f, l, lr "

		ego_clause = "OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH DISTINCT u, b, l, lr "


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
		remove_bookmark_node_clause = "MATCH (u:User), (b:Book), (l:Label) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" AND l.name = \""+bookmark_name.strip.upcase+"\" WITH u, b, l MATCH (u)-[lr:Labelled]->(l)-[r1:BookmarkedOn]->(r2:BookmarkNode)-[r3:BookmarkAction]->(b) DELETE r1, r3 WITH u, b, lr, l, r2 "
		
		feednext_clause = "MATCH (s)-[f1:FeedNext{user_id:"+user_id.to_s+"}]->(r2)-[f2:FeedNext{user_id:"+user_id.to_s+"}]->(e) CREATE (s)-[:FeedNext{user_id:"+user_id.to_s+"}]->(e) DELETE f1, f2 WITH u, b, lr, l, r2 "

		bookfeed_next_clause = "MATCH (s)-[b1:BookFeed{user_id:"+user_id.to_s+"}]->(r2)-[b2:BookFeed{user_id:"+user_id.to_s+"}]->(e) CREATE (s)-[:BookFeed{user_id:"+user_id.to_s+"}]->(e) DELETE b1, b2, r2 WITH u, b, lr, l "

		set_clause = "SET b.bookmark_count = CASE WHEN b.bookmark_count IS NULL THEN 0 ELSE toInt(b.bookmark_count) - 1 END, u.bookmark_count = CASE WHEN u.bookmark_count IS NULL THEN 0 ELSE toInt(u.bookmark_count) - 1 END, l.bookmark_count = CASE WHEN l.bookmark_count IS NULL THEN 0 ELSE toInt(l.bookmark_count) - 1 END, lr.bookmark_count = CASE WHEN lr.bookmark_count IS NULL THEN 0 ELSE toInt(lr.bookmark_count) - 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN 0 ELSE toInt(u.total_count) - "+Constants::BookmarkPoints.to_s+" END"

		clause = remove_bookmark_node_clause + feednext_clause + bookfeed_next_clause + set_clause

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
		
		mark_as_read_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" CREATE UNIQUE (u)-[:MarkAsReadAction]->(m:MarkAsReadNode{timestamp:"+Time.now.to_i.to_s+", book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+user_id.to_s+"})-[:MarkAsRead]->(b) SET m.name = u.name, m.email=u.email, m.isbn = b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m "

		feednext_clause = "MATCH (u)-[old:FeedNext]->(old_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[:FeedNext{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, m "

		bookfeed_clause = "MATCH (b)-[old:BookFeed]->(old_feed) CREATE UNIQUE (b)-[:BookFeed{user_id:"+user_id.to_s+"}]->(m)-[:BookFeed{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b "

		existing_ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) DELETE s, t)) WITH u, b, f "

		ego_clause = "OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH DISTINCT u, b "

		set_clause = "SET b.readers_count = CASE WHEN b.readers_count IS NULL THEN 1 ELSE toInt(b.readers_count) + 1 END, u.book_read_count = CASE WHEN u.book_read_count IS NULL THEN 1 ELSE toInt(u.book_read_count) + 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::MarkAsReadPoints.to_s+" ELSE toInt(u.total_count) + "+Constants::MarkAsReadPoints.to_s+" END"

		clause = mark_as_read_clause + feednext_clause + bookfeed_clause + existing_ego_clause + ego_clause + set_clause
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
		mark_as_unread_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" WITH u, b MATCH (u)-[r1:MarkAsReadAction]->(m:MarkAsReadNode)-[r2:MarkAsRead]->(b) DELETE r1, r2 WITH u, b, m "

		# delete rating action
		rating_clause = "OPTIONAL MATCH (u)-[r1:RatingAction]->(rn:RatingNode)-[r2:Rate]->(b) FOREACH (p IN CASE WHEN r1 IS NULL THEN [] ELSE [u] END | FOREACH (q IN CASE WHEN r2 IS NULL THEN [] ELSE [b] END | SET q.rating_count = CASE WHEN q.rating_count IS NULL THEN 0 ELSE toInt(q.rating_count) - 1 END,  p.total_count = CASE WHEN p.total_count IS NULL THEN 0 ELSE toInt(p.total_count) - "+Constants::RatingPoints.to_s+" END, p.rating_count = CASE WHEN p.rating_count IS NULL THEN 0 ELSE toInt(p.rating_count) - 1 END DELETE r1, r2))  WITH u, b, m, rn "

		#delete timing action
		timing_clause = "OPTIONAL MATCH (u)-[r1:TimingAction]->(tn:TimingNode)-[r2:Timer]->(b) FOREACH (p IN CASE WHEN r1 IS NULL THEN [] ELSE [u] END | FOREACH (q IN CASE WHEN r2 IS NULL THEN [] ELSE [b] END | SET p.total_count = CASE WHEN p.total_count IS NULL THEN 0 ELSE toInt(p.total_count) - "+Constants::ReadTimePoints.to_s+" END DELETE r1, r2)) WITH u, b, m, rn, tn "

		#delete feed relation
		feednext_clause = "MATCH (x)-[r1:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[r2:FeedNext{user_id:"+user_id.to_s+"}]->(y) CREATE  (x)-[:FeedNext{user_id:"+user_id.to_s+"}]->(y) DELETE r1, r2 WITH u, b, m, rn, tn "

		#delete rating feed
		rating_feed_clause = "OPTIONAL MATCH (x)-[r1:FeedNext{user_id:"+user_id.to_s+"}]->(rn)-[r2:FeedNext{user_id:"+user_id.to_s+"}]->(y) FOREACH (a IN CASE WHEN x IS NULL THEN [] ELSE [x] END | FOREACH (b IN CASE WHEN y IS NULL THEN [] ELSE [y] END |	CREATE  (a)-[:FeedNext{user_id:"+user_id.to_s+"}]->(b) DELETE r1, r2)) WITH u, b, m, rn, tn "

		#delete timing node feed
		timing_feed_clause = "OPTIONAL MATCH (x)-[r1:FeedNext{user_id:"+user_id.to_s+"}]->(tn)-[r2:FeedNext{user_id:"+user_id.to_s+"}]->(y) FOREACH (a IN CASE WHEN x IS NULL THEN [] ELSE [x] END | FOREACH (b IN CASE WHEN y IS NULL THEN [] ELSE [y] END |	CREATE  (a)-[:FeedNext{user_id:"+user_id.to_s+"}]->(b) DELETE r1, r2))  WITH u, b, m, rn, tn "

		#delete book feed relation
		bookfeed_clause = "MATCH (x)-[r1:BookFeed{user_id:"+user_id.to_s+"}]->(m)-[r2:BookFeed{user_id:"+user_id.to_s+"}]->(y) CREATE  (x)-[:BookFeed{user_id:"+user_id.to_s+"}]->(y) DELETE r1, r2, m WITH u, b, rn, tn  "

		rating_bookfeed_clause = "OPTIONAL MATCH (x)-[r1:BookFeed{user_id:"+user_id.to_s+"}]->(rn)-[r2:BookFeed{user_id:"+user_id.to_s+"}]->(y) FOREACH (a IN CASE WHEN x IS NULL THEN [] ELSE [x] END | FOREACH (b IN CASE WHEN y IS NULL THEN [] ELSE [y] END |	CREATE  (a)-[:BookFeed{user_id:"+user_id.to_s+"}]->(b) DELETE r1, r2, rn)) WITH u, b, tn "

		timing_node_bookfeed_clause = "OPTIONAL MATCH (x)-[r1:BookFeed{user_id:"+user_id.to_s+"}]->(tn)-[r2:BookFeed{user_id:"+user_id.to_s+"}]->(y) FOREACH (a IN CASE WHEN x IS NULL THEN [] ELSE [x] END | FOREACH (b IN CASE WHEN y IS NULL THEN [] ELSE [y] END |	CREATE  (a)-[:BookFeed{user_id:"+user_id.to_s+"}]->(b) DELETE r1, r2, tn)) WITH u, b "

		ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) WITH u, b, f OPTIONAL MATCH (f)-[old:Ego]->(old_ego) WHERE old_ego <> u FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH u, b "

		#update book and user properties
		set_clause = "SET b.readers_count = CASE WHEN b.readers_count IS NULL THEN 0 ELSE toInt(b.readers_count) - 1 END, u.book_read_count = CASE WHEN u.book_read_count IS NULL THEN 0 ELSE toInt(u.book_read_count) - 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN 0 ELSE toInt(u.total_count) - "+Constants::MarkAsReadPoints.to_s+" END"

		clause = mark_as_unread_clause + rating_clause + timing_clause +feednext_clause + rating_feed_clause + timing_feed_clause + bookfeed_clause + rating_bookfeed_clause + timing_node_bookfeed_clause + set_clause
		# WHERE r3.weight = 0 DELETE r3
		puts clause.blue.on_red
		puts "MARK AS UNREAD".green
		@neo.execute_query(clause)
	end

	# def self.write_a_review(user_id, book_id, review)
	# 	@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (b:Book{id:"+book_id+"})
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		CREATE (u)-[:Wrote]->(rv:Review{text:"+review+", comment_count:0, like_count:0, dislike_count:0, bookmark_count:0, view_count:0, timestamp:"+Time.now+"})-[:HeadComment]->(rv)<-[:has]-(b)
	# 		CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		SET b.review_count = b.review_count + 1
	# 		SET u.review_count = u.review_count + 1")
	# 	#update review cache for the book
	# 	#update popularity index for the book
	# 	#update popularity index for the author

	# 	#update review cache for the user
	# 	#update bookworm index for the user
	# 	#update extrovert index for the user

	# 	#update news feed for the book
	# 	#update news feed for the user
	# end

	# def self.edit_a_review(user_id, book_id, review)
	# 	@neo.execute_query("MATCH (u:User{id:"+user_id+"})-[:Wrote]->(rv:Review)-[:HeadComment]->(rv)<-[:has]-(b:Book{id:"+book_id+"})
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		SET rv.text = "+review+"
	# 		SET rv.timestamp = "+Time.now)
	# 	#update news feed for the book
	# 	#update news feed for the user
	# end

	# def self.comment_on_review(user_id, review_id, comment)
	# 	@neo.execute_query("MATCH (rv:Review{id:"+review_id+"})-[r:HeadComment]->(n), (u:User{id:"+user_id+"})
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		CREATE (n)<-[:NextComment]-(c:Comment{text:'"+comment+"', timestamp:"+Time.now+"})<-[:HeadComment]-(rv)
	# 		CREATE (u)-[:commented]->(c)
	# 		CREATE (u)-[:FeedNext]->(c)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		DELETE r
	# 		SET rv.comment_count = rv.comment_count + 1
	# 		SET u.comment_count = u.comment_count + 1")
	# 	#update comment cache for the review
	# 	#update popularity index for the book
	# 	#update popularity index for the author

	# 	#update bookworm index for the user
	# 	#update extrovert index for the user
	# 	#update popularity index for the user who wrote the review

	# 	#update news feed for the book
	# 	#update news feed for the user
	# end

	# def self.initiate_discussion(user_id, book_id, discussion)
	# 	@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (b:Book{id:"+book_id+"})
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		CREATE (u)-[:Discussed]->(d:Discussion{text:'"+discussion+"', like_count:0, dislike_count:0, bookmark_count:0, comment_count:0, timestamp:"+Time.now+"})-[:HeadComment]->(d)<-[:Discussions]-(b)
	# 		CREATE (u)-[:FeedNext]->(d)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		SET u.comment_count = u.comment_count + 1")
	# 	#update discussion cache for the book
	# 	#update popularity index for the book
	# 	#update popularity index for the author

	# 	#update bookworm index for the user
	# 	#update extrovert index for the user
	# 	#update popularity index for the author

	# 	#update news feed for the book
	# 	#update news feed for the user
	# end

	# def self.comment_on_discussion(user_id, discussion_id, comment)
	# 	@neo.execute_query("MATCH (d:Discussion{id:"+discussion_id+"})-[r:HeadComment]->(n), (u:User{id:"+user_id+"})
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		CREATE (n)<-[:NextComment]-(c:Comment{text:'"+comment+"', timestamp:"+Time.now+"})<-[:HeadComment]-(d)
	# 		CREATE (u)-[:commented]->(c)
	# 		CREATE (u)-[:FeedNext]->(c)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		DELETE r
	# 		SET rv.comment_count = rv.comment_count + 1
	# 		SET u.comment_count = u.comment_count + 1")
	# end

	# def self.like_discussion(user_id, discussion_id)
	# 	@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (d:Discussion{id:"+discussion_id+"})
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		OPTIONAL MATCH (u)-[r:Dislike]->(d)
	# 		DELETE r
	# 		CREATE (u)-[:Like{timestamp:"+Time.now+"}]->(d)
	# 		CREATE (u)-[:FeedNext]->(d)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		SET d.like_count = d.like_count + 1
	# 		SET u.dislike_count = u.dislike_count + 1")
	# end

	# def self.dislike_discussion(user_id, discussion_id)
	# 	@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (d:Discussion{id:"+discussion_id+"})
	# 		OPTIONAL MATCH (u)-[r:Like]->(d)
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		DELETE r
	# 		CREATE (u)-[:Dislike{timestamp:"+Time.now+"}]->(d)
	# 		CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		SET d.like_count = d.like_count - 1
	# 		SET u.like_count = u.like_count + 1")
	# end

	# def self.like_review(user_id, review_id)
	# 	@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
	# 		OPTIONAL MATCH (u)-[r:Dislike]->(rv)
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		DELETE r
	# 		CREATE (u)-[:Like]->(rv)
	# 		CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		SET rv.like_count = rv.like_count + 1
	# 		SET u.like_count = u.like_count + 1")
	# end

	# def self.dislike_review(user_id, review_id)
	# 	@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
	# 		OPTIONAL MATCH (u)-[r:Like]->(rv)
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		DELETE r
	# 		CREATE (u)-[:Dislike]->(rv)
	# 		CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		SET rv.like_count = rv.like_count - 1
	# 		SET u.dislike_count = u.dislike_count + 1")
	# end

	# def self.bookmark_review(user_id, review_id)
	# 	@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		CREATE (u)-[:BookmarkAction]->(bm:Bookmark)-[:Bookmarked]->(rv)
	# 		CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		SET rv.bookmark_count = rv.bookmark_count + 1
	# 		SET u.bookmark_count = u.bookmark_count + 1")
	# end

	# def self.review_read(user_id, review_id)
	# 	@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
	# 		SET rv.view_count = rv.view_count + 1
	# 		CREATE (u)-[:Read]->(rv)")
	# end

	# def self.follow_user(user1_id, user2_id)
	# 	@neo.execute_query("MATCH (u1:User{id:"+user1_id+"}), (u2:User{id:"+user2_id+"})
	# 		OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
	# 					   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
	# 		CREATE (u1)-[:Follow]->(u2)
	# 		CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
	# 		CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
	# 		SET u1.follows_count = u1.follows_count + 1
	# 		SET u2.followed_by_count = u2.followed_by_count + 1")
	# end

	# def self.unfollow_user
	# 	@neo.execute_query("MATCH (u1:User{id:"+user1_id+"}), (u2:User{id:"+user2_id+"}), (u1)-[r:Follow]->(u2)
	# 		SET u1.follows_count = u1.follows_count - 1
	# 		SET u2.followed_by_count = u2.followed_by_count - 1
	# 		DELETE r")
	# end


	# CREATE (user:User{email:EMAIL, verification_token:VERIFICATION_TOKEN, password:PASSWORD, like_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0}), 
	# (user)-[fn:FeedNext{user_id:ID(user)}]->(user), 
	# (user)-[:Ego{user_id:ID(user)}]->(user)
	# WITH user
	# MATCH (bm:Label{primary_label:true}) 
	# CREATE (user)-[:BookmarkAction{user_id:ID(user)}]->(bm) 
	# ************************************************
	def self.create_user(email, password=nil, verification_token=nil)
		@neo ||= self.neo_init
		clause = "CREATE (user:User{email:\""+email+"\", verification_token:\""+verification_token+"\", password:\""+password+"\", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, last_book: "+Constants::BestBook.to_s+", amateur: true}), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user MATCH(bm:Label{primary_label:true}) CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm) WITH DISTINCT(user) MATCH (all_user:User) WHERE all_user <> user CREATE (user)-[:Follow]->(all_user), (user)<-[:Follow]-(all_user)"
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
		clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" OPTIONAL MATCH p=(u)-[r:Ego*..]->(friend:User) WHERE all(r2 in relationships(p) WHERE r2.user_id="+user_id.to_s+") WITH friend MATCH (friend)-[:FeedNext*]->(feed) RETURN labels(feed), feed, feed.timestamp ORDER BY feed.timestamp DESC SKIP "+skip_count.to_s+" LIMIT 10 "
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
			tweet_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" CREATE UNIQUE (u)-[:Commented]->(t:Tweet{tweet:\""+tweet[:message]+"\", timestamp:"+Time.now.to_i.to_s+", book_id: "+book_id.to_s+", title: b.title, author_name: b.author_name, user_id: "+user_id.to_s+", label1:\""+tweet[:label1]+"\", label2:\""+tweet[:label2]+"\", icon:\""+tweet[:icon]+"\"})-[:CommentedOn]->(b) SET t.isbn=b.isbn, t.name=u.name, t.email=u.email, t.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, t "
			with_clause = ", b "
			bookfeed_clause = "MATCH (b)-[old:BookFeed]->(old_feed) CREATE UNIQUE (b)-[:BookFeed{user_id:"+user_id.to_s+"}]->(t)-[:BookFeed{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, t "+with_clause
			set_clause = ", b.comment_count = CASE WHEN b.comment_count IS NULL THEN 1 ELSE toInt(b.comment_count) + 1 END"
		else
			tweet_clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" CREATE UNIQUE (u)-[:Commented]->(t:Tweet{tweet:\""+tweet[:message]+"\", timestamp:"+Time.now.to_i.to_s+", user_id: "+user_id.to_s+", label1:\""+tweet[:label1]+"\", label2:\""+tweet[:label2]+"\", icon:\""+tweet[:icon]+"\"}) SET t.name=u.name, t.email=u.email, t.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, t "
			with_clause = " "
			bookfeed_clause = " "
			set_clause = " "
		end

		
		feednext_clause = "MATCH (u)-[old:FeedNext]->(old_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(t)-[:FeedNext{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, t "+with_clause
		
		existing_ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) DELETE s, t)) WITH u, f "+with_clause

		ego_clause = "OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH DISTINCT u "+with_clause

		set_clause = "SET u.comment_count = CASE WHEN u.comment_count IS NULL THEN 1 ELSE toInt(u.comment_count) + 1 END" + set_clause
		
		clause = tweet_clause + feednext_clause + bookfeed_clause + existing_ego_clause + ego_clause + set_clause
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	def self.recommend_book(user_id, friend_id, book_id)
		@neo || self.neo_init

		recommend_clause = "MATCH (u:User), (b:Book), (friend:User) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" AND ID(friend)="+friend_id.to_s+" CREATE UNIQUE (u)-[:RecommendedTo]->(friend)-[:RecommendedAction]->(rn:RecommendNode{book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+user_id.to_s+", friend_id:"+friend_id.to_s+", timestamp:"+Time.now.to_i.to_s+", email:u.email, friend_email:friend.email})-[:Recommended]->(b) SET rn.name=u.name, rn.friend_name=friend.name, rn.isbn=b.isbn, rn.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, rn "

		feednext_clause = "MATCH (u)-[old:FeedNext]->(old_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(rn)-[:FeedNext{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, rn "

		bookfeed_clause = "MATCH (b)-[old:BookFeed]->(old_feed) CREATE UNIQUE (b)-[:BookFeed{user_id:"+user_id.to_s+"}]->(rn)-[:BookFeed{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, rn "

		existing_ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) DELETE s, t)) WITH u, b, f "

		ego_clause = "OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH DISTINCT u, b "

		set_clause = "SET u.total_count = CASE WHEN u.total_count IS NULL THEN 1 ELSE u.total_count + "+Constants::RecommendationPoints.to_s+" END, b.recommended_count = CASE WHEN b.recommended_count IS NULL THEN 1 ELSE toInt(b.recommended_count) + 1 END"

		clause = recommend_clause + feednext_clause + bookfeed_clause + existing_ego_clause + ego_clause + set_clause
		puts clause.blue.on_red
		@neo.execute_query clause
	end


end