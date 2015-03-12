module BookmarkHelper
	def self.bookmark_book(user_id, book_id, bookmark_name)
		#FIXME: bookmark book
		is_books_left_a_mark_on_you = bookmark_name.to_s.strip.upcase == "BOOKSLEFTAMARKONYOU" ? true : false

		@neo ||= self.neo_init
		bookmark_clause = _match_user_and_book(user_id, book_id) + " WITH user, book MERGE (user)-[labelled:Labelled]->(label:Label{name: \"" + bookmark_name.strip.upcase + "\"}), (label)-[:BookmarkedOn]->(bookmark: BookmarkNode{label:\"" + bookmark_name.strip.upcase + "\", book_id:" + book_id.to_s + ", user_id:" + user_id.to_s + "}), (bookmark)-[:BookmarkAction]->(book) SET bookmark.title = book.title,  bookmark.author = book.author_name, bookmark.name = user.name, bookmark.email = user.email, bookmark.isbn = book.isbn, bookmark.timestamp = " + Time.now.to_i.to_s + ", bookmark.thumb = CASE WHEN user.thumb IS NULL THEN '' ELSE user.thumb END WITH user, book, bookmark, label, labelled "

		feednext_clause = _feednext_clause(user_id)+", label, labelled "

		bookfeed_next_clause = _bookfeed_clause(user_id)+", label, labelled "

		existing_ego_clause = _existing_ego_clause+", label, labelled "

		ego_clause = _ego_clause + ", label, labelled "



		set_clause = "SET book.bookmark_count = CASE WHEN book.bookmark_count IS NULL THEN 1 ELSE toInt(book.bookmark_count) + 1 END, user.bookmark_count = CASE WHEN user.bookmark_count IS NULL THEN 1 ELSE toInt(user.bookmark_count) + 1 END, label.bookmark_count = CASE WHEN label.bookmark_count IS NULL THEN 1 ELSE toInt(label.bookmark_count) + 1 END, labelled.bookmark_count = CASE WHEN labelled.bookmark_count IS NULL THEN 1 ELSE toInt(labelled.bookmark_count) + 1 END, user.total_count = CASE WHEN user.total_count IS NULL THEN " + Constants::BookmarkPoints.to_s + " ELSE toInt(user.total_count) + " + Constants::BookmarkPoints.to_s + " END"

		update_

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

	private
		def _match_user(user_id)
		"MATCH (u:User) WHERE ID(u)="+user_id.to_s+" "
	end

	def _match_user_and_book(user_id, book_id)
		"MATCH (user:User), (book:Book) WHERE ID(user) = " + user_id.to_s + " AND ID(book) = " + book_id.to_s + " "
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
		find_old_feed = "MATCH (user)-[old:FeedNext]->(old_feed) "
		create_new_feed = "CREATE UNIQUE (user)-[:FeedNext{user_id:"+user_id.to_s+"}]->(bookmark)-[:FeedNext{user_id:"+user_id.to_s+"}]->(old_feed) "
		if without_book
			delete_old_feed = "DELETE old WITH user, bookmark "
		else
			delete_old_feed = "DELETE old WITH user, book, bookmark "
		end
		clause = find_old_feed + create_new_feed + delete_old_feed
		clause
	end

	def _bookfeed_clause user_id
		find_old_book_feed = "MATCH (book)-[old:BookFeed]->(old_feed) "
		create_new_book_feed = "CREATE UNIQUE (book)-[:BookFeed{user_id:" + user_id.to_s + "}]->(bookmark)-[:BookFeed{user_id:" + user_id.to_s + "}]->(old_feed) "
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