module BookmarkHelper
		def self.bookmark_book(user_id, book_id, bookmark_name)

		@neo ||= self.neo_init
		bookmark_clause = _match_user_and_book(user_id, book_id) + " WITH user, book MERGE (user)-[labelled:Labelled]->(label:Label{name: \"" + bookmark_name.strip.upcase + "\"}), (label)-[:BookmarkedOn]->(bookmark: BookmarkNode{label:\"" + bookmark_name.strip.upcase + "\", book_id:" + book_id.to_s + ", user_id:" + user_id.to_s + "}), (bookmark)-[:BookmarkAction]->(book) SET bookmark.title = book.title,  bookmark.author = book.author_name, bookmark.name = user.name, bookmark.email = user.email, bookmark.isbn = book.isbn, bookmark.timestamp = " + Time.now.to_i.to_s + ", bookmark.thumb = CASE WHEN user.thumb IS NULL THEN '' ELSE user.thumb END WITH user, book, bookmark, label, labelled "

		feednext_clause = _feednext_clause(user_id)+", label, labelled "

		bookfeed_next_clause = _bookfeed_clause(user_id)+", label, labelled "

		existing_ego_clause = _existing_ego_clause+", label, labelled "

		ego_clause = _ego_clause + ", label, labelled "

		
		set_clause = "SET book.bookmark_count = CASE WHEN book.bookmark_count IS NULL THEN 1 ELSE toInt(book.bookmark_count) + 1 END, user.bookmark_count = CASE WHEN user.bookmark_count IS NULL THEN 1 ELSE toInt(user.bookmark_count) + 1 END, label.bookmark_count = CASE WHEN label.bookmark_count IS NULL THEN 1 ELSE toInt(label.bookmark_count) + 1 END, labelled.bookmark_count = CASE WHEN labelled.bookmark_count IS NULL THEN 1 ELSE toInt(labelled.bookmark_count) + 1 END, user.total_count = CASE WHEN user.total_count IS NULL THEN " + Constants::BookmarkPoints.to_s + " ELSE toInt(user.total_count) + " + Constants::BookmarkPoints.to_s + " END"

		update_root_category_like_clause = _get_book_left_a_mark_on_you_clause bookmark_name

		clause = bookmark_clause + feednext_clause + bookfeed_next_clause + existing_ego_clause + ego_clause + set_clause + update_root_category_like_clause
		puts clause.blue.on_red
		puts "BOOK BOOKMARKED".green
		@neo.execute_query(clause)
	end


	def _get_book_left_a_mark_on_you_clause bookmark_name
		bookmark_name.to_s.strip.upcase!
		
		update_root_category_likes_clause = " WITH user, label, bookmark, book OPTIONAL MATCH (user)-->(label)-->(bookmark)-->(book) WITH user, COUNT(DISTINCT book) as total_book_count MATCH (user)-->(label)-->(bookmark)-->(book)-[:FromCategory]->()-[:HasRoot*0..1]->(root_category{is_root:true}) WITH total_book_count, user, root_category OPTIONAL MATCH  (user)-[likes_category:Likes]->(root_category) WITH user, likes_category, root_category, total_book_count MATCH (user)-[likes_category:Likes]->(root_category) SET likes_category.likeability_index = TOFLOAT(likes_category.weight*1.0/total_book_count)"
									
		set_favourite_clause = ", likes_category.favourite = true"
		
		case bookmark_name

		when BookLeftAMarkOnYouUpcase 
			clause = update_root_category_likes_clause + set_favourite_clause
		when Constants::FromFacebookUpcase 
			clause = update_root_category_likes_clause
		when Constants::MarkAsReadUpcase 
			clause = update_root_category_likes_clause
		else
			clause = ""
		end
		clause	
	end

	private

	def _match_user(user_id)
		"MATCH (user:User) WHERE ID(user)="+user_id.to_s+" WITH user"
	end

	def _match_user_and_book(user_id, book_id)
		"MATCH (user:User), (book:Book) WHERE ID(user) = " + user_id.to_s + " AND ID(book) = " + book_id.to_s + " "
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
end