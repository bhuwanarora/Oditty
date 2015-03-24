class Neo

	def initialize
		@neo = Neography::Rest.new
	end

	def order_init
		" ORDER BY "
	end

	def return_init
		" RETURN "
	end

	def skip skip_count
		" SKIP " + skip_count.to_s + " "
	end

	def return(*params)
		" RETURN " + params.join(", ")
	end

	def limit limit_count
		" LIMIT " + limit_count.to_s + " "
	end

	def self.execute clause
		@neo ||= self.initialize
		@neo.execute_query clause
	end

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

	def _existing_ego_clause(without_book=false)
		find_friends = "OPTIONAL MATCH (u)<-[:FoFllow]-(f:User) "
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