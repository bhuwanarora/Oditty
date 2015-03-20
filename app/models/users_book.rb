class UsersBook < Neo

	def self.initialize(book_id, user_id)
		@book_id = book_id
		@user_id = user_id
	end

	def get_similar_books
		#Add category 
		#FIXME get_similar_books
		"MATCH (b:Book{id:"+@book_id+"})-[h1:Has]->(t:Tag)<-[h2:Has]-(sb:Book), 
			(u:User{id:"+@user_id+"})
			WHERE b <> sb AND
			NOT (u)-[:MarkAsReadAction]->(:MarkAsRead)-[:MarkAsRead]->(sb) AND
			NOT (u)-[:BookmarkAction]->(:Bookmark)-[:Bookmarked]->(sb)
			WITH SUM(h1.weight * h2.weight) AS xyDotProduct,
              SQRT(REDUCE(xDot = 0, a IN COLLECT(h1) | xDot + a.weight^2)) AS xLength,
              SQRT(REDUCE(yDot = 0, b IN COLLECT(h2) | yDot + b.weight^2)) AS yLength,
              b, sb
            RETURN xyDotProduct/(xLength*yLength) as similarity_index
			LIMIT 5 
			ORDER BY similarity_index DESC, sb.gr_rating DESC"
	end

	def get_basic_details
		clause = "MATCH (b:Book), (u:User) WHERE ID(b)="+@book_id.to_s+" AND ID(u)="+@user_id.to_s+" WITH u, b OPTIONAL MATCH (b)-[bt:Belongs_to]->(g:Genre) RETURN b as book, rn.rating as rating, tm.time_index as time_index, COLLECT(DISTINCT l1.name) as labels, COLLECT(DISTINCT l2.name) as selected_labels, m.timestamp as mark_as_read, COLLECT(ID(friend)) as friend_ids, COLLECT(friend.thumb) as friend_thumb, COUNT(friend) as friends_count, COLLECT(g.name) as genres, COLLECT(bt.weight) as weights"
		clause
	end

	def self.get_book_details
		@neo = Neography::Rest.new
		clause = "MATCH (b:Book), (u:User) WHERE ID(b)="+@book_id.to_s+" AND ID(u)="+@user_id.to_s+" WITH u, b OPTIONAL MATCH (u)-[:RatingAction]->(rn:RatingNode)-[:Rate]->(b) OPTIONAL MATCH (u)-[:TimingAction]->(tm:TimingNode)-[:Timer]->(b) OPTIONAL MATCH (u)-[:Labelled]->(l1:Label) OPTIONAL MATCH (u)-[:Labelled]->(l2:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(b) OPTIONAL MATCH (u)-[:MarkAsReadAction]->(m)-[:MarkAsRead]->(b) OPTIONAL MATCH (u)-[:EndorseAction]->(e)-[:Endorsed]->(b) OPTIONAL MATCH (u)-[:Follow]->(friend:User)-[:MarkAsReadAction]->(m_friend)-[:MarkAsRead]->(b) OPTIONAL MATCH (b)-[bt:Belongs_to]->(g:Genre) RETURN " + return_book_data + ", rn.rating as user_rating, tm.time_index as user_time_index, COLLECT(DISTINCT l1.name) as labels, COLLECT(DISTINCT l2.name) as selected_labels, m.timestamp as status, ID(e) as endorse_status, COLLECT(ID(friend)) as friends_id, COLLECT(friend.thumb) as friends_thumb, COUNT(friend) as friends_count, COLLECT(g.name) as genres, COLLECT(bt.weight) as genres_weight"
		clause
	end

	def self.rate(rating)

		rating_clause = _match_user_and_book(@user_id, @book_id)+" CREATE UNIQUE (u)-[:RatingAction]->(m:RatingNode{book_id:"+book_id.to_s+", title:b.title, author:b.author_name, user_id:"+@user_id.to_s+"})-[:Rate]->(b) SET m.rating="+rating.to_s+", m.timestamp="+Time.now.to_i.to_s+", m.name=u.name, m.email=u.email, m.isbn=b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m "

		set_clause = "SET b.rating_count = CASE WHEN b.rating_count IS NULL THEN 1 ELSE toInt(b.rating_count) + 1 END, u.rating_count = CASE WHEN u.rating_count IS NULL THEN 1 ELSE toInt(u.rating_count) + 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::RatingPoints.to_s+" ELSE toInt(u.total_count) + "+Constants::RatingPoints.to_s+" END"

		clause = rating_clause + _delete_existing_feednext_clause(@user_id) + _feednext_clause(@user_id) + _bookfeed_clause(@user_id) + _existing_ego_clause + _ego_clause + set_clause
		puts "RATE".green
		clause
		#update mark as read cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update mark as read cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.endorse
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

	def self.remove_endorse
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


	def self.record_time(time)
		rating_clause = _match_user_and_book(@user_id, @book_id)+" CREATE UNIQUE (u)-[:TimingAction]->(m:TimingNode{book_id:"+@book_id.to_s+", title:b.title, author:b.author_name, user_id:"+@user_id.to_s+"})-[:Timer]->(b) SET m.timestamp="+Time.now.to_i.to_s+", m.time_index="+time.to_s+", m.name=u.name, m.email=u.email, m.isbn=b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END  WITH u, b, m "

		set_clause = "SET u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::ReadTimePoints.to_s+" ELSE toInt(u.total_count) + "+Constants::ReadTimePoints.to_s+" END"

		clause = rating_clause + _delete_existing_feednext_clause(@user_id) + _feednext_clause(@user_id) + _bookfeed_clause(@user_id) + _existing_ego_clause + _ego_clause + set_clause
		puts "TIMER".green
		clause
	end
	
	def self.comment(tweet)
		if @book_id
			tweet_clause = _match_user_and_book(@user_id, @book_id)+" CREATE UNIQUE (u)-[:Commented]->(m:Tweet{tweet:\""+tweet[:message]+"\", timestamp:"+Time.now.to_i.to_s+", book_id: "+@book_id.to_s+", title: b.title, author_name: b.author_name, user_id: "+@user_id.to_s+", label1:\""+tweet[:label1]+"\", label2:\""+tweet[:label2]+"\", icon:\""+tweet[:icon]+"\"})-[:CommentedOn]->(b) SET m.isbn=b.isbn, m.name=u.name, m.email=u.email, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m "
			with_clause = ", b "
			bookfeed_clause = _bookfeed_clause(@user_id)
			set_clause = ", b.comment_count = CASE WHEN b.comment_count IS NULL THEN 1 ELSE toInt(b.comment_count) + 1 END"
		else
			tweet_clause = _match_user(@user_id)+" CREATE UNIQUE (u)-[:Commented]->(m:Tweet{tweet:\""+tweet[:message]+"\", timestamp:"+Time.now.to_i.to_s+", user_id: "+@user_id.to_s+", label1:\""+tweet[:label1]+"\", label2:\""+tweet[:label2]+"\", icon:\""+tweet[:icon]+"\"}) SET m.name=u.name, m.email=u.email, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, m "
			with_clause = " "
			bookfeed_clause = " "
			set_clause = " "
		end

		
		feednext_clause = _feednext_clause(@user_id, true)+with_clause
		
		existing_ego_clause = _existing_ego_clause(true)+with_clause

		ego_clause = _ego_clause(true)+with_clause

		set_clause = "SET u.comment_count = CASE WHEN u.comment_count IS NULL THEN 1 ELSE toInt(u.comment_count) + 1 END" + set_clause
		
		clause = tweet_clause + feednext_clause + bookfeed_clause + existing_ego_clause + ego_clause + set_clause
		clause
	end

	def self.recommend(friend_id)
		total_count = "SET u.total_count = CASE WHEN u.total_count IS NULL THEN 1 ELSE u.total_count + "+Constants::RecommendationPoints.to_s+" END "
		recommended_count = "SET b.recommended_count = CASE WHEN b.recommended_count IS NULL THEN 1 ELSE toInt(b.recommended_count) + 1 END"

		clause = _recommend_clause(@user_id, @book_id, friend_id) + _feednext_clause(@user_id) + _bookfeed_clause(@user_id) + _existing_ego_clause + _ego_clause + total_count + recommended_count
		clause
	end

	def self.create_thumb_request(thumb_url)
		thumb_request_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+@user_id.to_s+" AND ID(b) = "+@book_id.to_s+" CREATE UNIQUE (u)-[:DataEdit]->(t:ThumbRequest{url: \""+thumb_url+"\", user_id: "+@user_id.to_s+", book_id: "+@book_id.to_s+"})-[:DataEditRequest]->(b) SET t.name=u.name, t.email=u.email, t.thumb=u.thumb, t.title=b.title, t.author_name=b.author_name, t.isbn=b.isbn, t.timestamp = "+Time.now.to_i.to_s+" WITH u, b, t "

		feednext_clause = "MATCH (u)-[old:FeedNext]->(old_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+@user_id.to_s+"}]->(t)-[:FeedNext{user_id:"+@user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, t "

		bookfeed_clause = "MATCH (b)-[old:BookFeed]->(old_feed) CREATE UNIQUE (b)-[:BookFeed{user_id:"+@user_id.to_s+"}]->(t)-[:BookFeed{user_id:"+@user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, t "

		existing_ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) DELETE s, t)) WITH u, b, f "

		ego_clause = "OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH DISTINCT u, b "

		clause = thumb_request_clause + feednext_clause + bookfeed_clause + existing_ego_clause + ego_clause
		clause
	end

end