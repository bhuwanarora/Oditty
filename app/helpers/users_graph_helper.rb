module UsersGraphHelper

	def self.neo_init
		@neo = Neography::Rest.new
	end

	def self.bookmark_book(user_id, book_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (b:Book{id:"+book_id+"})
			CREATE (u)-[:BookmarkAction]->(bm:Bookmark)-[:Bookmarked]->(b)")
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
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (b:Book{id:"+book_id+"})
			CREATE (u)-[:MarkAsReadAction]->(m:MarkAsRead)-[:MarkAsRead]->(b)")
		#update mark as read cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update mark as read cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user

	end

	def self.mark_as_unread(user_id, book_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"})-[r1:MarkAsReadAction]->(m:MarkAsRead)-[r2:MarkAsRead]->(b:Book{id:"+book_id+"})
			DELETE m, r1, r2")
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
			CREATE (u)-[:Wrote]->(rv:Review{text:"+review+"})-[:HeadComment]->(rv)<-[:has]-(b)")
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
			CREATE (n)<-[:NextComment]-(c:Comment{text:'"+comment+"'})<-[:HeadComment]-(rv)")
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
			CREATE (u)-[:Discussed]->(d:Discussion{text:'"+discussion+"'})-[:HeadComment]->(d)<-[:Discussions]-(b)")
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
			CREATE (n)<-[:NextComment]-(c:Comment{text:'"+comment+"'})<-[:HeadComment]-(d)")
	end

	def self.like_discussion(user_id, discussion_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (d:Discussion{id:"+discussion_id+"})
			OPTIONAL MATCH (u)-[r:Dislike]->(d)
			DELETE r
			CREATE (u)-[:Like]->(d)")
	end

	def self.dislike_discussion(user_id, discussion_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (d:Discussion{id:"+discussion_id+"})
			OPTIONAL MATCH (u)-[r:Like]->(d)
			DELETE r
			CREATE (u)-[:Dislike]->(d)")
	end

	def self.like_review(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			OPTIONAL MATCH (u)-[r:Dislike]->(rv)
			DELETE r
			CREATE (u)-[:Like]->(rv)")
	end

	def self.dislike_review(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			OPTIONAL MATCH (u)-[r:Like]->(rv)
			DELETE r
			CREATE (u)-[:Dislike]->(rv)")
	end

	def self.bookmark_review(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			CREATE (u)-[:BookmarkAction]->(bm:Bookmark)-[:Bookmarked]->(rv)")
	end

	def self.review_read(user_id, review_id)
		@neo.execute_query("MATCH (u:User{id:"+user_id+"}), (rv:Review{id:"+review_id+"})
			CREATE (u)-[:Read]->(rv)")
	end

	def self.follow_user(user1_id, user2_id)
		@neo.execute_query("MATCH (u1:User{id:"+user1_id+"}), (u2:User{id:"+user2_id+"})
			CREATE (u1)-[:Follow]->(u2)")
	end

end