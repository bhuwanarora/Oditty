module UsersGraphHelper

	def self.neo_init
		@neo = Neography::Rest.new
	end

	def self.bookmark_book(user_id, book_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (b:Book{id:"+book_id+"})
			OPTIONAL MATCH (u)-[r:FeedNext{id:"+user_id+"}]->(top_feed),
							(u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			CREATE (u)-[:BookmarkAction]->(bm:Bookmark{timestamp:"+Time.now+"})-[:Bookmarked]->(b)
			CREATE (u)-[:FeedNext]->(bm)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			DELETE r, ego
			SET b.bookmark_count = b.bookmark_count + 1
			SET u.bookmark_count = u.bookmark_count + 1")
		#update bookmark cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookmark cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.remove_bookmark(user_id, book_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"})-[r1:BookmarkAction]->(bm:Bookmark)-[r2:Bookmarked]->(b:Book{id:"+book_id+"})
			OPTIONAL MATCH (s)-[f1:FeedNext]->(bm)-[f2:FeedNext]->(e)
			CREATE (s)-[:FeedNext]->(e)
			SET b.bookmark_count = b.bookmark_count - 1
			SET u.bookmark_count = u.bookmark_count - 1
			DELETE bm, r1, r2, f1, f2")
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
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), 
			(b:Book{id:"+book_id+"})-[:Belongs_to]->(:Category)-[r:Has_root]->(c:Category)
			OPTIONAL MATCH (u)-[fr:FeedNext{id:"+user_id+"}]->(top_feed),
						   (u)<-[:Follow]-(f)-[ego:Ego]->(ego_user)
			MERGE (c)<-[ur:Tendency_for]-(u)-[:MarkAsReadAction]->(m:MarkAsReadNode{timestamp:"+Time.now+"})-[:MarkAsRead]->(b)
			CREATE (u)-[:FeedNext]->(m)-[:FeedNext]->(top_feed)
			CREATE (f)-[:Ego]->(u)-[:Ego]->(ego_user)
			DELETE fr, ego
			SET b.readers_count = b.readers_count + 1
			SET u.book_read_count = u.book_read_count + 1
			ON CREATE SET ur.weight = r.weight
			ON MATCH SET ur.weight = ur.weight + r.weight")
		#update mark as read cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update mark as read cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user

	end

	def self.mark_as_unread(user_id, book_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"})-[r1:MarkAsReadAction]->(m:MarkAsReadNode)-[r2:MarkAsRead]->(b:Book{id:"+book_id+"})-[:Belongs_to]->(:Category)-[r:Has_root]->(c:Category),
			(c)<-[r3:Tendency_for]-(u)
			OPTIONAL MATCH (s)-[f1:FeedNext]->(m)-[f2:FeedNext]->(e)
			CREATE (s)-[:FeedNext]->(e)
			SET r3.weight = r3.weight - r.weight
			SET b.readers_count = b.readers_count - 1
			SET u.book_read_count = u.book_read_count  1
			DELETE m, r1, r2, f1, f2
			WHERE r3.weight = 0
			DELETE r3")
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

	def self.create_user
		@neo.execute_query("CREATE (u:User{name:'"+username+"' like_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0})")
	end

	def self.get_news_feed_for_user user_id
		@neo.execute_query("MATCH (u:User{id:"+user_id+"})-[:Ego{id:"+user_id+"}]->(ego_user),
		(ego_user)-[r:FeedNext]->(f)
		RETURN f, r
		ORDER r.timestamp DESC")
	end


end