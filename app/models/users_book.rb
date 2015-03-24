class UsersBook < Neo

	def self.initialize(book_id, user_id)
		@book_id = book_id
		@user_id = user_id
	end

	def match
		" MATCH (book:Book), (user:User) WHERE ID(book)="+@book_id.to_s+" AND ID(user)="+@user_id.to_s+" WITH user, book "
	end

	def get_basic_details
		clause = " MATCH (b:Book), (u:User) WHERE ID(b)="+@book_id.to_s+" AND ID(u)="+@user_id.to_s+" WITH u, b OPTIONAL MATCH (b)-[bt:Belongs_to]->(g:Genre) RETURN b as book, rn.rating as rating, tm.time_index as time_index, COLLECT(DISTINCT l1.name) as labels, COLLECT(DISTINCT l2.name) as selected_labels, m.timestamp as mark_as_read, COLLECT(ID(friend)) as friend_ids, COLLECT(friend.thumb) as friend_thumb, COUNT(friend) as friends_count, COLLECT(g.name) as genres, COLLECT(bt.weight) as weights "
		clause
	end

	def self.optional_match_rating
		" OPTIONAL MATCH (user)-[:RatingAction]->(rating_node:RatingNode)-[:Rate]->(book) "
	end

	def self.optional_match_timing_node
		" OPTIONAL MATCH (user)-[:TimingAction]->(timing_node:TimingNode)-[:Timer]->(book) "
	end

	def self.optional_match_endorse
		" OPTIONAL MATCH (user)-[:EndorseAction]->(endorse)-[:Endorsed]->(book) "
	end

	def self.optional_match_mark_as_read
		" OPTIONAL MATCH (user)-[mark_as_read:MarkAsReadAction]->(:MarkAsReadNode)--(book) "
	end

	def self.friends_book
		" OPTIONAL MATCH (user)-[:Follow]->(friend:User)-[:MarkAsReadAction]->(m_friend)-[:MarkAsRead]->(book) "
	end

	def self.get_book_details
		match + UsersBook.rating_clause + UsersBook.optional_match_timing_node + User.label_clause + 
		Bookmark.match("book", "Book") + UsersBook.optional_match_mark_as_read + UsersBook.optional_match_endorse + UsersBook.friends_book + Book.genre_clause + return_init + Book.get_basic_info + ", rating_node.rating as user_rating, timing_node.time_index as user_time_index, COLLECT(DISTINCT user_label.name) as labels, COLLECT(DISTINCT label.name) as selected_labels, mark_as_read.timestamp as status, ID(endorse) as endorse_status, COLLECT(ID(friend)) as friends_id, COLLECT(friend.thumb) as friends_thumb, COUNT(friend) as friends_count, COLLECT(genre.name) as genres, COLLECT(belongs_to.weight) as genres_weight"
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

	def get_similar_books
		#Add category 
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

end