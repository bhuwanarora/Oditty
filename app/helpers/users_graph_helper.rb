module UsersGraphHelper

	def self.neo_init
		@neo = Neography::Rest.new
	end

	
	# ************************************************

	# MATCH (u:User)
	# WHERE ID(u) = USER_ID
	# OPTIONAL MATCH (u)-[:BookmarkAction{user_id:USER_ID}]->(bm:Label)
	# RETURN bm.name

	# ************************************************
	def self.get_bookmark_labels user_id
		@neo ||= self.neo_init
		clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" OPTIONAL MATCH (u)-[:Labelled]->(bm:Label) RETURN bm.name"
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
		clause = "MATCH (u:User)-[r:BookmarkAction]->(bm:BookmarkNode)-[:Bookmarked]->(b:Book) WHERE ID(u)="+user_id.to_s+" RETURN b.isbn as isbn, ID(b), bm.name as label, r.timestamp as timestamp ORDER BY timestamp SKIP "+skip_count.to_s
		puts clause.blue.on_red
		@neo.execute_query(clause)["data"]
	end


	# ************************************************

	# MATCH (u:User), (b:Book)
	# WHERE ID(u)=USER_ID AND ID(b)=BOOK_ID
	# CREATE (u)-[:BookmarkAction{timestamp:TIMESTAMP, user_id:USER_ID}]->(bm:BookmarkNode{name: BOOKMARK_NAME})-[:Bookmarked{user_id:USER_ID}]->(b) 
	# WITH u, b, bm

	# MERGE (l:Label{name: BOOKMARK_NAME})
	# CREATE UNIQUE (b)<-[:BookmarkedOn]-(l)<-[:Labelled]-(u)
	# WITH u, b, bm, l

	# MATCH (u)-[old:FeedNext]->(type_feed) 
	# CREATE UNIQUE (u)-[:FeedNext{user_id:USER_ID}]->(bm)-[:FeedNext{user_id:USER_ID}]->(type_feed) 
	# DELETE old 
	# WITH u, b, bm

	# MATCH (b)-[old:BookFeed]->(old_feed) 
	# CREATE UNIQUE (b)-[:BookFeed{user_id:USER_ID}]->(bm)-[:BookFeed{user_id:USER_ID}]->(old_feed) 
	# DELETE old 
	# WITH u, b, bm 

	# OPTIONAL MATCH (u)<-[:Follow]-(f) 
	# WHERE f <> u 
	# WITH u, b, f 

	# MATCH (f)-[old:Ego]-(old_ego) 
	# CREATE UNIQUE (f)-[:Ego{user_id:ID(f)}]->(u)-[:Ego{user_id:ID(f)}]->(old_ego) 
	# DELETE old 

	# SET b.bookmark_count = b.bookmark_count + 1  
	# SET u.bookmark_count = u.bookmark_count + 1 

	# ************************************************
	def self.bookmark_book(user_id, book_id, bookmark_name)
		#FIXME: bookmark book
		@neo ||= self.neo_init
		bookmark_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" CREATE (u)-[:BookmarkAction{timestamp:"+Time.now.to_i.to_s+", user_id:"+user_id.to_s+"}]->(bm:BookmarkNode{name: \""+bookmark_name.strip.upcase+"\"})-[:Bookmarked{user_id:"+user_id.to_s+"}]->(b) WITH u, b, bm "
		label_clause = "MERGE (l:Label{name: \""+bookmark_name.strip.upcase+"\"}) CREATE UNIQUE (b)<-[:BookmarkedOn]-(l)<-[:Labelled]-(u) WITH u, b, bm, l "
		feednext_clause = "MATCH (u)-[old:FeedNext]->(type_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(bm)-[:FeedNext{user_id:"+user_id.to_s+"}]->(type_feed) DELETE old WITH u, b, bm "
		bookfeed_next_clause = "MATCH (b)-[old:BookFeed]->(old_feed) CREATE UNIQUE (b)-[:BookFeed{user_id:"+user_id.to_s+"}]->(bm)-[:BookFeed{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, bm "
		follow_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f) WHERE f <> u WITH u, b, f "
		ego_clause = "MATCH (f)-[old:Ego]-(old_ego) CREATE UNIQUE (f)-[:Ego{user_id:ID(f)}]->(u)-[:Ego{user_id:ID(f)}]->(old_ego) DELETE old "
		set_clause = "SET b.bookmark_count = b.bookmark_count + 1  SET u.bookmark_count = u.bookmark_count + 1 "
		clause = bookmark_clause + label_clause + feednext_clause + bookfeed_next_clause + follow_clause + ego_clause + set_clause
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

	# ************************************************

	# MATCH (u:User), (b:Book)
	# WHERE ID(u)=USER_ID AND ID(b)=BOOK_ID
	# MATCH (u)-[r1:BookmarkAction{user_id:USER_ID}]->(bm:BookmarkNode{name: BOOKMARK_NAME})-[r2:Bookmarked{user_id:USER_ID}]->(b) 
	# DELETE r1, bm,r2
	# WITH u, b, bm

	# MATCH  (b)<-[r3:BookmarkedOn]-(l:Label{name: BOOKMARK_NAME})<-[:Labelled]-(u)
	# DELETE r3
	# WITH u, b, bm, l

	# MATCH (s)-[f1:FeedNext{user_id:USER_ID}]->(bm)-[f2:FeedNext{user_id:USER_ID}]->(e) 
	# CREATE (s)-[:FeedNext{user_id:USER_ID}]->(e) 
	# DELETE f1, f2
	# WITH u, b, bm

	# MATCH (s)-[b1:BookFeed{user_id:USER_ID}]->(bm)-[b2:BookFeed{user_id:USER_ID}]->(e) 
	# CREATE (s)-[:BookFeed{user_id:USER_ID}]->(e)
	# DELETE b1, b2
	# WITH u, b

	# SET b.bookmark_count = b.bookmark_count - 1  
	# SET u.bookmark_count = u.bookmark_count - 1 

	# ************************************************

	def self.remove_bookmark(user_id, book_id, bookmark_name)
		#FIXME: remove_bookmark
	remove_bookmark_node_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" MATCH (u)-[r1:BookmarkAction{user_id:"+user_id.to_s+"}]->(bm:BookmarkNode{name: \""+bookmark_name.strip.upcase+"\"})-[r2:Bookmarked{user_id:"+user_id.to_s+"}]->(b) DELETE r1, bm,r2 WITH u, b, bm "
		remove_bookmark_label_on_clause = "MATCH  (b)<-[r3:BookmarkedOn]-(l:Label{name: \""+bookmark_name.strip.upcase+"\"})<-[:Labelled]-(u) DELETE r3 WITH u, b, bm, l "
		feednext_clause = "MATCH (s)-[f1:FeedNext{user_id:"+user_id.to_s+"}]->(bm)-[f2:FeedNext{user_id:"+user_id.to_s+"}]->(e) CREATE (s)-[:FeedNext{user_id:"+user_id.to_s+"}]->(e) DELETE f1, f2 WITH u, b, bm "
		bookfeed_next_clause = "MATCH (s)-[b1:BookFeed{user_id:"+user_id.to_s+"}]->(bm)-[b2:BookFeed{user_id:"+user_id.to_s+"}]->(e)CREATE (s)-[:BookFeed{user_id:"+user_id.to_s+"}]->(e) DELETE b1, b2 WITH u, b "
		set_clause = "SET b.bookmark_count = b.bookmark_count - 1  SET u.bookmark_count = u.bookmark_count - 1"
		clause = remove_bookmark_node_clause + remove_bookmark_label_on_clause + feednext_clause + bookfeed_next_clause + set_clause
		puts clause.blue.on_red
		puts "REMOVE BOOKMARKED".green
		@neo.execute_query(clause)
		# @neo.execute_query("MATCH (u:User{id:"+user_id.to_s+"})-[r1:BookmarkAction]->(bm:Bookmark)-[r2:Bookmarked]->(b:Book{id:"+book_id+"})
		# 	OPTIONAL MATCH (s)-[f1:FeedNext]->(bm)-[f2:FeedNext]->(e)
		# 	CREATE (s)-[:FeedNext]->(e)
		# 	SET b.bookmark_count = b.bookmark_count - 1
		# 	SET u.bookmark_count = u.bookmark_count - 1
		# 	DELETE bm, r1, r2, f1, f2")
		#ego feed update
		#update bookmark cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookmark cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end




	# ************************************************

	# MATCH (u:User), (b:Book) 
	# WHERE ID(u)=USER_ID AND ID(b)=BOOK_ID 
	# CREATE UNIQUE (u)-[:MarkAsReadAction]->(m:MarkAsReadNode{timestamp:TIMESTAMP, 
		# book_id:BOOK_ID, 
		# title:b.title, 
		# author_name: b.author_name, 
		# user_id:USER_ID, 
		# name:u.email})-[:MarkAsRead]->(b) 
	# WITH u, b, m 

	# MATCH (u)-[old:FeedNext]->(type_feed) 
	# CREATE UNIQUE (u)-[:FeedNext{user_id:USER_ID}]->(m)-[:FeedNext{user_id:USER_ID}]->(type_feed) 
	# DELETE old 
	# WITH u, b, m

	# OPTIONAL MATCH (u)<-[:Follow]-(f) 
	# WHERE f <> u 
	# WITH u, b, f 

	# MATCH (f)-[old:Ego]-(old_ego) 
	# CREATE UNIQUE (f)-[:Ego{user_id:ID(f)}]->(u)-[:Ego{user_id:ID(f)}]->(old_ego) 
	# DELETE old 

	# SET b.readers_count = b.readers_count + 1  
	# SET u.book_read_count = u.book_read_count + 1 

	# ************************************************
	def self.mark_as_read(user_id, book_id)
		#FIXME mark_as_read
		@neo ||= self.neo_init
		# clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" OPTIONAL MATCH (b)-[:Belongs_to]->(:Category)-[r:Has_root]->(c:Category), (u)-[fr:FeedNext]->(top_feed), (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user) WHERE fr.user_id="+user_id.to_s+" CREATE (u)-[:MarkAsReadAction]->(m:MarkAsReadNode{timestamp:"+Time.now.to_i.to_s+"})-[:MarkAsRead]->(b) MERGE (c)<-[ur:Tendency_for]-(u) ON CREATE SET ur.weight = r.weight ON MATCH SET ur.weight = ur.weight + r.weight CREATE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[:FeedNext{user_id:"+user_id.to_s+"}]->(top_feed) CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user) DELETE fr, ego SET b.readers_count = b.readers_count + 1 SET u.book_read_count = u.book_read_count + 1"
		mark_as_read_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" CREATE UNIQUE (u)-[:MarkAsReadAction]->(m:MarkAsReadNode{timestamp:"+Time.now.to_i.to_s+", book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+user_id.to_s+", name:u.email, isbn:b.isbn})-[:MarkAsRead]->(b) WITH u, b, m "

		feednext_clause = "MATCH (u)-[old:FeedNext]->(type_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[:FeedNext{user_id:"+user_id.to_s+"}]->(type_feed) DELETE old WITH u, b, m "

		follow_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f) WHERE f <> u WITH u, b, f "

		ego_clause = "MATCH (f)-[old:Ego]-(old_ego) CREATE UNIQUE (f)-[:Ego{user_id:ID(f)}]->(u)-[:Ego{user_id:ID(f)}]->(old_ego) DELETE old "

		set_clause = "SET b.readers_count = b.readers_count + 1  SET u.book_read_count = u.book_read_count + 1 "

		clause = mark_as_read_clause + feednext_clause + follow_clause + ego_clause + set_clause
		puts "MARK AS READ".green
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


	# ************************************************

	# MATCH (u:User)-[r1:MarkAsReadAction]->(m:MarkAsReadNode)-[r2:MarkAsRead]->(b:Book) 
	# WHERE ID(u)=USER_ID AND ID(b)=BOOK_ID 
	# DELETE r1, r2, m
	# WITH u, b, m

	# MATCH (s)-[f1:FeedNext{user_id:USER_ID}]->(m)-[f2:FeedNext{user_id:USER_ID}]->(e) 
	# CREATE (s)-[:FeedNext{user_id:USER_ID}]->(e) 
	# DELETE f1, f2
	# WITH u, b

	# SET b.readers_count = b.readers_count - 1 
	# SET u.book_read_count = u.book_read_count - 1 

	# ************************************************
	def self.mark_as_unread(user_id, book_id)
		#FIXME mark_as_unread
		@neo ||= self.neo_init
		# clause = "MATCH (u:User)-[r1:MarkAsReadAction]->(m:MarkAsReadNode)-[r2:MarkAsRead]->(b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" OPTIONAL MATCH (b)-[:Belongs_to]->(:Category)-[r:Has_root]->(c:Category), (c)<-[r3:Tendency_for]-(u), (s)-[f1:FeedNext]->(m)-[f2:FeedNext]->(e) CREATE (s)-[:FeedNext]->(e) SET r3.weight = r3.weight - r.weight SET b.readers_count = b.readers_count - 1 SET u.book_read_count = u.book_read_count - 1 DELETE m, r1, r2, f1, f2"
		
		mark_as_unread_clause = "MATCH (u:User)-[r1:MarkAsReadAction]->(m:MarkAsReadNode)-[r2:MarkAsRead]->(b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b)="+book_id.to_s+" DELETE r1, r2, m WITH u, b, m "
		feednext_clause = "MATCH (s)-[f1:FeedNext{user_id:"+user_id.to_s+"}]->(m)-[f2:FeedNext{user_id:"+user_id.to_s+"}]->(e) 	CREATE (s)-[:FeedNext{user_id:"+user_id.to_s+"}]->(e) DELETE f1, f2 WITH u, b "
		set_clause = "SET b.readers_count = b.readers_count - 1 SET u.book_read_count = u.book_read_count - 1 "
		clause = mark_as_unread_clause + feednext_clause + set_clause
		# WHERE r3.weight = 0 DELETE r3
		puts clause.blue.on_red
		puts "MARK AS UNREAD".green
		@neo.execute_query(clause)
		#ego feed update
		#update mark as read cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update mark as read cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.write_a_review(user_id, book_id, review)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (b:Book{id:"+book_id+"})
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			CREATE (u)-[:Wrote]->(rv:Review{text:"+review+", comment_count:0, like_count:0, dislike_count:0, bookmark_count:0, view_count:0, timestamp:"+Time.now+"})-[:HeadComment]->(rv)<-[:has]-(b)
			CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			SET b.review_count = b.review_count + 1
			SET u.review_count = u.review_count + 1")
		#update review cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update review cache for the user
		#update bookworm index for the user
		#update extrovert index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.edit_a_review(user_id, book_id, review)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"})-[:Wrote]->(rv:Review)-[:HeadComment]->(rv)<-[:has]-(b:Book{id:"+book_id+"})
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			SET rv.text = "+review+"
			SET rv.timestamp = "+Time.now)
		#update news feed for the book
		#update news feed for the user
	end

	def self.comment_on_review(user_id, review_id, comment)
		@neo.execute_query("MATCH (rv:Review{id:"+review_id+"})-[r:HeadComment]->(n), (u:User{id:"+user_id+"})
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			CREATE (n)<-[:NextComment]-(c:Comment{text:'"+comment+"', timestamp:"+Time.now+"})<-[:HeadComment]-(rv)
			CREATE (u)-[:commented]->(c)
			CREATE (u)-[:FeedNext]->(c)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			DELETE r
			SET rv.comment_count = rv.comment_count + 1
			SET u.comment_count = u.comment_count + 1")
		#update comment cache for the review
		#update popularity index for the book
		#update popularity index for the author

		#update bookworm index for the user
		#update extrovert index for the user
		#update popularity index for the user who wrote the review

		#update news feed for the book
		#update news feed for the user
	end

	def self.initiate_discussion(user_id, book_id, discussion)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (b:Book{id:"+book_id+"})
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			CREATE (u)-[:Discussed]->(d:Discussion{text:'"+discussion+"', like_count:0, dislike_count:0, bookmark_count:0, comment_count:0, timestamp:"+Time.now+"})-[:HeadComment]->(d)<-[:Discussions]-(b)
			CREATE (u)-[:FeedNext]->(d)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			SET u.comment_count = u.comment_count + 1")
		#update discussion cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookworm index for the user
		#update extrovert index for the user
		#update popularity index for the author

		#update news feed for the book
		#update news feed for the user
	end

	def self.comment_on_discussion(user_id, discussion_id, comment)
		@neo.execute_query("MATCH (d:Discussion{id:"+discussion_id+"})-[r:HeadComment]->(n), (u:User{id:"+user_id+"})
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			CREATE (n)<-[:NextComment]-(c:Comment{text:'"+comment+"', timestamp:"+Time.now+"})<-[:HeadComment]-(d)
			CREATE (u)-[:commented]->(c)
			CREATE (u)-[:FeedNext]->(c)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			DELETE r
			SET rv.comment_count = rv.comment_count + 1
			SET u.comment_count = u.comment_count + 1")
	end

	def self.like_discussion(user_id, discussion_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (d:Discussion{id:"+discussion_id+"})
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			OPTIONAL MATCH (u)-[r:Dislike]->(d)
			DELETE r
			CREATE (u)-[:Like{timestamp:"+Time.now+"}]->(d)
			CREATE (u)-[:FeedNext]->(d)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			SET d.like_count = d.like_count + 1
			SET u.dislike_count = u.dislike_count + 1")
	end

	def self.dislike_discussion(user_id, discussion_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (d:Discussion{id:"+discussion_id+"})
			OPTIONAL MATCH (u)-[r:Like]->(d)
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			DELETE r
			CREATE (u)-[:Dislike{timestamp:"+Time.now+"}]->(d)
			CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			SET d.like_count = d.like_count - 1
			SET u.like_count = u.like_count + 1")
	end

	def self.like_review(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			OPTIONAL MATCH (u)-[r:Dislike]->(rv)
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			DELETE r
			CREATE (u)-[:Like]->(rv)
			CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			SET rv.like_count = rv.like_count + 1
			SET u.like_count = u.like_count + 1")
	end

	def self.dislike_review(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			OPTIONAL MATCH (u)-[r:Like]->(rv)
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			DELETE r
			CREATE (u)-[:Dislike]->(rv)
			CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			SET rv.like_count = rv.like_count - 1
			SET u.dislike_count = u.dislike_count + 1")
	end

	def self.bookmark_review(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			CREATE (u)-[:BookmarkAction]->(bm:Bookmark)-[:Bookmarked]->(rv)
			CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			SET rv.bookmark_count = rv.bookmark_count + 1
			SET u.bookmark_count = u.bookmark_count + 1")
	end

	def self.review_read(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			SET rv.view_count = rv.view_count + 1
			CREATE (u)-[:Read]->(rv)")
	end

	def self.follow_user(user1_id, user2_id)
		@neo.execute_query("MATCH (u1:User{id:"+user1_id+"}), (u2:User{id:"+user2_id+"})
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			CREATE (u1)-[:Follow]->(u2)
			CREATE (u)-[:FeedNext]->(rv)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			SET u1.follows_count = u1.follows_count + 1
			SET u2.followed_by_count = u2.followed_by_count + 1")
	end

	def self.unfollow_user
		@neo.execute_query("MATCH (u1:User{id:"+user1_id+"}), (u2:User{id:"+user2_id+"}), (u1)-[r:Follow]->(u2)
			SET u1.follows_count = u1.follows_count - 1
			SET u2.followed_by_count = u2.followed_by_count - 1
			DELETE r")
	end


	# CREATE (user:User{email:EMAIL, verification_token:VERIFICATION_TOKEN, password:PASSWORD, like_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0}), 
	# (user)-[fn:FeedNext{user_id:ID(user)}]->(user), 
	# (user)-[:Ego{user_id:ID(user)}]->(user)
	# WITH user
	# MATCH (bm:Label{basic:true}) 
	# CREATE (user)-[:BookmarkAction{user_id:ID(user)}]->(bm) 
	def self.create_user(email, password, verification_token)
		@neo ||= self.neo_init
		clause = "CREATE (user:User{email:\""+email+"\", verification_token:\""+verification_token+"\", password:\""+password+"\", like_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0}), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user MATCH(bm:Label) CREATE (user)-[:BookmarkAction{user_id:ID(user)}]->(bm)"
		puts clause.blue.on_red
		@neo.execute_query(clause)
	end

	# MATCH (u:User)-[:FeedNext*0..]->(news_feed)
	# WHERE (ID)=USER_ID
	# RETURN news_feed
	def self.get_news_feed user_id
		#FIXME get_news_feed_for_user
		@neo ||= self.neo_init
		clause = "MATCH (u:User)-[:FeedNext*0..]->(news_feed) WHERE ID(u)="+user_id.to_s+" RETURN labels(news_feed), news_feed"
		puts clause.blue.on_red
		@neo.execute_query clause
	end

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

	# MATCH ()-[r:BookmarkAction]-() DELETE (r)
	# MATCH ()-[r:Bookmarked]-() DELETE (r)
	# MATCH ()-[r:BookmarkedOn]-() DELETE (r)
	# MATCH ()-[r:Labelled]-() DELETE (r)
	# MATCH ()-[r:FeedNext]-() DELETE (r)
	# MATCH (b:Book)-[r:BookFeed]-(:BookmarkNode) CREATE (b)-[:BookFeed]->(b) DELETE (r)

end