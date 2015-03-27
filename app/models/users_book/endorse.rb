class UsersBook::Endorse < UsersBook
	def self.add
		create_endorse_node_clause = _match_user_and_book(@user_id, @book_id) + " WITH u, b MERGE (u)-[:EndorseAction]->(endorse:EndorseNode{created_at: " + Time.now.to_i.to_s + ", book_id:ID(b), user_id:ID(u), updated_at:  " + Time.now.to_i.to_s + "})-[endorsed:Endorsed]->(b) WITH u, endorse, b"
		find_old_feed_clause = " MATCH (u)-[old:FeedNext]->(old_feed)  "
		create_new_feed_clause = " MERGE (u)-[:FeedNext{user_id:" + @user_id.to_s + "}]->(endorse)-[:FeedNext{user_id:" + user_id.to_s + "}]->(old_feed) DELETE old WITH u, endorse, b "
		find_old_book_feed_clause = " MATCH (b)-[old:BookFeed{book_id:" + @book_id.to_s + "}]->(old_feed) "
		create_new_book_feed_clause = " MERGE (b)-[:BookFeed{book_id:" + @book_id.to_s + "}]->(endorse)-[:BookFeed{book_id:" + book_id.to_s + "}]->(old_feed) DELETE old WITH u, endorse, b "
		set_clause = "SET b.endorse_count = CASE WHEN b.endorse_count IS NULL THEN 1 ELSE toInt(b.endorse_count) + 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::EndorsePoints.to_s+" ELSE toInt(u.total_count) + "+Constants::EndorsePoints.to_s+" END"
		existing_ego_clause = _existing_ego_clause

		ego_clause = _ego_clause 

		clause = create_endorse_node_clause + find_old_feed_clause + create_new_feed_clause + find_old_book_feed_clause + create_new_book_feed_clause + existing_ego_clause + ego_clause + set_clause
		puts "ENDORSE".green
		clause

	end

	def self.remove
		# delete mark as read relation
		remove_endorse_clause = _match_user_and_book(@user_id, @book_id)+" WITH u, b MATCH (u)-[r1:EndorseAction]->(m:EndorseNode)-[r2:Endorsed]->(b) DELETE r1, r2 WITH u, b, m "

		#delete feed relation
		feednext_clause = _delete_feed_clause(@user_id)

		#delete book feed relation
		bookfeed_clause = _delete_book_clause(@user_id)

		delete_node = " DELETE m WITH u, b "

		#update book and user properties
		book_readers_count = "SET b.endorse_count = CASE WHEN b.endorse_count IS NULL THEN 0 ELSE toInt(b.endorse_count) - 1 END, "
		user_total_count = "u.total_count = CASE WHEN u.total_count IS NULL THEN 0 ELSE toInt(u.total_count) - "+Constants::EndorsePoints.to_s+" END"

		clause = remove_endorse_clause + feednext_clause + bookfeed_clause + delete_node + book_readers_count + user_total_count
		
		puts "REMOVE ENDORSE".green
		clause
	end
end