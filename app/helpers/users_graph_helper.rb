module UsersGraphHelper

	def self.neo_init
		@neo = Neography::Rest.new
	end

	def self.bookmark_book(user_id, book_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (b:Book{id:"+book_id+"})
			CREATE (u)-[:BookmarkAction]->(bm:Bookmark)-[:Bookmarked]->(b)
			SET b.bookmark_count = b.bookmark_count + 1")
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
			SET b.bookmark_count = b.bookmark_count - 1
			DELETE bm, r1, r2")
		#update bookmark cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookmark cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.mark_as_read(user_id, book_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (b:Book{id:"+book_id+"})-[:Belongs_to]->(:Category)-[r:Has_root]->(c:Category)
			MERGE (c)<-[ur:Tendency_for]-(u)-[:MarkAsReadAction]->(m:MarkAsReadNode)-[:MarkAsRead]->(b)
			SET b.readers_count = b.readers_count + 1
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
			SET r3.weight = r3.weight - r.weight
			SET b.readers_count = b.readers_count - 1
			DELETE m, r1, r2
			WHERE r3.weight = 0
			DELETE r3")
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
			CREATE (u)-[:Wrote]->(rv:Review{text:"+review+", comment_count:0, like_count:0, dislike_count:0, bookmark_count:0, view_count:0})-[:HeadComment]->(rv)<-[:has]-(b)
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
			SET rv.text = "+review)
		#update news feed for the book
		#update news feed for the user
	end

	def self.comment_on_review
		@neo.execute_query("MATCH (rv:Review{id:"+review_id+"})-[r:HeadComment]->(n)
			DELETE r
			CREATE (n)<-[:NextComment]-(c:Comment{text:'"+comment+"'})<-[:HeadComment]-(rv)
			SET rv.comment_count = rv.comment_count + 1")
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
			CREATE (u)-[:Discussed]->(d:Discussion{text:'"+discussion+"', like_count:0, dislike_count:0, bookmark_count:0, comment_count:0})-[:HeadComment]->(d)<-[:Discussions]-(b)")
		#update discussion cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookworm index for the user
		#update extrovert index for the user
		#update popularity index for the author

		#update news feed for the book
		#update news feed for the user
	end

	def self.comment_on_discussion
		@neo.execute_query("MATCH (d:Discussion{id:"+discussion_id+"})-[r:HeadComment]->(n)
			DELETE r
			CREATE (n)<-[:NextComment]-(c:Comment{text:'"+comment+"'})<-[:HeadComment]-(d)
			SET rv.comment_count = rv.comment_count + 1")
	end

	def self.like_discussion(user_id, discussion_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (d:Discussion{id:"+discussion_id+"})
			OPTIONAL MATCH (u)-[r:Dislike]->(d)
			DELETE r
			CREATE (u)-[:Like]->(d)
			SET d.like_count = d.like_count + 1")
	end

	def self.dislike_discussion(user_id, discussion_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (d:Discussion{id:"+discussion_id+"})
			OPTIONAL MATCH (u)-[r:Like]->(d)
			DELETE r
			CREATE (u)-[:Dislike]->(d)
			SET d.like_count = d.like_count - 1")
	end

	def self.like_review(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			OPTIONAL MATCH (u)-[r:Dislike]->(rv)
			DELETE r
			CREATE (u)-[:Like]->(rv)
			SET rv.like_count = rv.like_count + 1")
	end

	def self.dislike_review(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			OPTIONAL MATCH (u)-[r:Like]->(rv)
			DELETE r
			CREATE (u)-[:Dislike]->(rv)
			SET rv.like_count = rv.like_count - 1")
	end

	def self.bookmark_review(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			CREATE (u)-[:BookmarkAction]->(bm:Bookmark)-[:Bookmarked]->(rv)
			SET rv.bookmark_count = rv.bookmark_count + 1")
	end

	def self.review_read(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			SET rv.view_count = rv.view_count + 1
			CREATE (u)-[:Read]->(rv)")
	end

	def self.follow_user(user1_id, user2_id)
		@neo.execute_query("MATCH (u1:User{id:"+user1_id+"}), (u2:User{id:"+user2_id+"})
			CREATE (u1)-[:Follow]->(u2)
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
	end

	def self.create_book
	end

end