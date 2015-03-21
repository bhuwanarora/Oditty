class Bookmark < Neo
	# Read 									= "Read"
	# IntendingToRead 						= "IntendingToRead"
	# DidntFeelLikeReadingItAfterAPoint 		= "DidntFeelLikeReadingItAfterAPoint"
	# PretendIHaveRead 						= "PretendIHaveRead"
	# SavingForWhenIHaveMoreTime 				= "SavingForWhenIHaveMoreTime"
	# WillNeverRead 							= "WillNeverRead"
	# PurelyForShow 							= "PurelyForShow"
	# ReadButCantRememberASingleThingAboutIt 	= "ReadButCantRememberASingleThingAboutIt"
	# WishIHadntRead 							= "WishIHadntRead"
	# CurrentlyReading 						= "CurrentlyReading"
	# HaveLeftAMarkOnMe 						= "HaveLeftAMarkOnMe"
	# NotWorthReading 						= "NotWorthReading"
	# FromFacebook 							= "FromFacebook"
	# PlanToBuy 								= "PlanToBuy"
	# IOwnthis 								= "IOwnthis"
	# Visited 								= "Visited"

	def initialize(user_id, id, book_id)
		@user_id = user_id
		@book_id = book_id
	end

	def self.match
		" OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book) "
	end

	def self.create_label_bookmark_node
		" (label)-[bookmarked_on:BookmarkedOn]->(bookmark_node: BookmarkNode{label:\""+@bookmark_key+"\", id:"+@id.to_s+", user_id:"+@user_id.to_s+"}) " 
	end

	def self.create_bookmark_node_book
		" (bookmark_node)-[bookmark_action:BookmarkAction]->(book) "
	end

	def self.set_title
		" SET bookmark_node.title = book.title "
	end

	def self.set_author_name
		" SET bookmark_node.author = book.author_name "
	end

	def self.set_name
		" SET bookmark_node.name = user.name "
	end

	def self.set_email
		" SET bookmark_node.email=user.email "
	end

	def self.set_isbn
		" SET bookmark_node.isbn = book.isbn "
	end

	def self.set_created_at
		" SET bookmark_node.created_at = " + Time.now.to_i.to_s + " "
	end

	def self.set_updated_at
		" SET bookmark_node.updated_at = " + Time.now.to_i.to_s + " "
	end

	def self.set_thumb
		" SET bookmark_node.thumb = CASE WHEN user.thumb IS NULL THEN '' ELSE user.thumb END "
	end

	def self.add
		bookmark_clause = UsersBook.new(@user_id, @book_id).match + User.create_label(@bookmark_key) + Bookmark.create_label_bookmark_node + Bookmark.create_bookmark_node_book + Bookmark.set_title + Bookmark.set_author_name + Bookmark.set_name + Bookmark.set_email + Bookmark.set_isbn + Bookmark.set_timestamp + Bookmark.set_created_at + Bookmark.set_updated_at + " WITH user, book, bookmark_node, label, labelled "

		feednext_clause = Feed::User.new(@user_id).create("bookmark") + ", label, labelled "

		bookfeed_next_clause = _bookfeed_clause+", label, labelled "

		existing_ego_clause = _existing_ego_clause+", label, labelled "

		ego_clause = _ego_clause + ", label, labelled "


		set_clause = "SET book.bookmark_count = CASE WHEN book.bookmark_count IS NULL THEN 1 ELSE toInt(book.bookmark_count) + 1 END, user.bookmark_count = CASE WHEN user.bookmark_count IS NULL THEN 1 ELSE toInt(user.bookmark_count) + 1 END, label.bookmark_count = CASE WHEN label.bookmark_count IS NULL THEN 1 ELSE toInt(label.bookmark_count) + 1 END, labelled.bookmark_count = CASE WHEN labelled.bookmark_count IS NULL THEN 1 ELSE toInt(labelled.bookmark_count) + 1 END, user.total_count = CASE WHEN user.total_count IS NULL THEN "+Constants::BookmarkPoints.to_s+" ELSE toInt(user.total_count) + "+Constants::BookmarkPoints.to_s+" END"

		clause = bookmark_clause + feednext_clause + bookfeed_next_clause + existing_ego_clause + ego_clause + set_clause
		puts "BOOK BOOKMARKED".green
		#update bookmark cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookmark cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.remove
		remove_bookmark_node_clause = "MATCH (u:User), (b:Book), (l:Label) WHERE ID(u)="+@user_id.to_s+" AND ID(b)="+@id.to_s+" AND l.name = \""+@bookmark_key.strip.upcase+"\" WITH u, b, l MATCH (u)-[lr:Labelled]->(l)-[r1:BookmarkedOn]->(m:BookmarkNode)-[r3:BookmarkAction]->(b) DELETE r1, r3 WITH u, b, lr, l, m "
		
		feednext_clause = _delete_feed_clause(@user_id) + ", lr, l "

		bookfeed_next_clause = _delete_book_clause(@user_id) + ", lr, l "

		delete_node = "DELETE m WITH u, b, l, lr "

		set_clause = "SET b.bookmark_count = CASE WHEN b.bookmark_count IS NULL THEN 0 ELSE toInt(b.bookmark_count) - 1 END, u.bookmark_count = CASE WHEN u.bookmark_count IS NULL THEN 0 ELSE toInt(u.bookmark_count) - 1 END, l.bookmark_count = CASE WHEN l.bookmark_count IS NULL THEN 0 ELSE toInt(l.bookmark_count) - 1 END, lr.bookmark_count = CASE WHEN lr.bookmark_count IS NULL THEN 0 ELSE toInt(lr.bookmark_count) - 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN 0 ELSE toInt(u.total_count) - "+Constants::BookmarkPoints.to_s+" END"

		clause = remove_bookmark_node_clause + feednext_clause + bookfeed_next_clause + delete_node + set_clause

		puts "REMOVE BOOKMARKED".green
		
		#ego feed update
		#update bookmark cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookmark cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.read

	end

	def self.intending_to_read

	end

	def self.didnt_feel_like_reading_it_after_a_point

	end

	def self.pretend_i_have_read

	end

	def self.saving_for_when_i_have_more_time

	end

	def self.will_never_read

	end

	def self.purely_for_show

	end

	def self.read_but_cant_remember_a_single_thing_about_it

	end

	def self.wish_i_hadnt_read

	end

	def self.currently_reading

	end

	def self.have_left_a_mark_on_me
		match_user_to_books_clause = " WITH u, l, m, b OPTIONAL MATCH (u)-->(l)-->(m)-->(b) WITH user, COUNT(DISTINCT book) as total_book_count MATCH (user)-->(label)-->(bookmark)-->(book)-[:FromCategory]->()-[:HasRoot*0..1]->(root_category{is_root:true}) WITH total_book_count, user, root_category "
		match_user_to_category_clause = "OPTIONAL MATCH  (user)-[likes_category:Likes]->(root_category) WITH user, likes_category, root_category, total_book_count MATCH (user)-[likes_category:Likes]->(root_category) "
		set_likeability_index_clause = "SET likes_category.likeability_index = TOFLOAT(likes_category.weight*1.0/total_book_count)"
		clause = match_user_to_books_clause + match_user_to_category_clause + set_likeability_index_clause							
		
		set_favourite_clause = ", likes_category.favourite = true"
		# case @bookmark_key

		# when Constants::BookLeftAMarkOnYouUpcase 
		# 	clause = update_root_category_likes_clause + set_favourite_clause
		# when Constants::FromFacebookUpcase 
		# 	clause = update_root_category_likes_clause
		# when Constants::MarkAsReadUpcase 
		# 	clause = update_root_category_likes_clause
		# else
		# 	clause = ""
		# end
		clause	
	end

	def self.not_worth_reading

	end

	def self.from_facebook

	end

	def self.plan_to_buy

	end

	def self.i_own_this

	end

	def self.visited

	end

	private

	def _match_user_and_book
		"MATCH (user:User), (book:Book) WHERE ID(user) = " + @user_id.to_s + " AND ID(book) = " + @id.to_s + " "
	end

	def _bookfeed_clause
		find_old_book_feed = "MATCH (book)-[old:BookFeed]->(old_feed) "
		create_new_book_feed = "CREATE UNIQUE (book)-[:BookFeed{user_id:" + @user_id.to_s + "}]->(bookmark)-[:BookFeed{user_id:" + @user_id.to_s + "}]->(old_feed) "
		delete_old_book_feed = "DELETE old WITH user, book, bookmark "
		clause = find_old_book_feed + create_new_book_feed + delete_old_book_feed
		clause
	end

	def _existing_ego_clause(without_book=false)
		find_friends = "OPTIONAL MATCH (user)<-[:Follow]-(friend:User) "
		find_me_in_friends_ego_chain = "OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(friend)}]->(user)-[r2:Ego{user_id:ID(friend)}]->(x2) "
		remove_me_from_friends_ego_chain = "FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(friend)}]->(x2) DELETE s, t)) "
		if without_book
			with_clause = "WITH user, friend "
		else
			with_clause = "WITH user, book, friend "
		end
		clause = find_friends + find_me_in_friends_ego_chain + remove_me_from_friends_ego_chain + with_clause
		clause
	end

	def _ego_clause(without_book=false)
		friends_old_ego_clause = "OPTIONAL MATCH (friend)-[old:Ego{user_id:ID(friend)}]->(old_ego) "
		create_new_and_delete_old_ego_clause = "FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN friend IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(user)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) "
		if without_book
			with_clause = "WITH DISTINCT user "
		else
			with_clause = "WITH DISTINCT user, book "
		end
		clause = friends_old_ego_clause + create_new_and_delete_old_ego_clause + with_clause
		clause
	end
end