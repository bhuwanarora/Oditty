class UsersBook < Neo

	def initialize(book_id, user_id)
		@book_id = book_id
		@user_id = user_id
	end

	def handle_searched
		match + Bookmark::Type::Visited.match + User.merge_searched + UsersBook.return_group(User.basic_info) 
	end

	def match 
		" MATCH (book:Book), (user:User) WHERE ID(book)="+@book_id.to_s+" AND ID(user)="+@user_id.to_s+" WITH user, book "
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

	def self.optional_match_bookmark
		" OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book) "
	end

	def self.friends_book
		" OPTIONAL MATCH (user)-[:Follow]->(friend:User)-[:MarkAsReadAction]->(m_friend)-[:MarkAsRead]->(book) "
	end

	def get_basic_details
		match + Book.new(@book_id).match_author +  ", user " + UsersBook.optional_match_rating + UsersBook.optional_match_timing_node + User.match_label + Bookmark::Node::BookLabel.optional_match_path_public + UsersBook.optional_match_endorse + UsersBook.friends_book + Book.optional_match_genre  +  " WITH DISTINCT genre, user, book, belongs_to,  rating_node, timing_node, user_label, label, bookmark_node, endorse, friend, author ORDER BY genre.gr_book_count DESC " + UsersBook.return_group(Book.detailed_info, "rating_node.rating as user_rating", "timing_node.time_index as user_time_index", "COLLECT(DISTINCT {" +Label.grouped_basic_info + ", status: ID(bookmark_node)}) as shelves", "ID(endorse) as endorse_status", "COLLECT(ID(friend)) as friends_id", "COLLECT(friend.thumb) as friends_thumb", "COUNT(friend) as friends_count", "COLLECT(DISTINCT genre.name)[0..5] as genres", "COLLECT(belongs_to.weight)[0..5] as genres_weight", "ID(author) AS author_id ")
	end

	def self.record_time(time)
		rating_clause = _match_user_and_book(@user_id, @book_id)+" CREATE UNIQUE (u)-[:TimingAction]->(m:TimingNode{book_id:"+@book_id.to_s+", title:b.title, author:b.author_name, user_id:"+@user_id.to_s+"})-[:Timer]->(b) SET m.timestamp="+Time.now.to_i.to_s+", m.time_index="+time.to_s+", m.name=u.name, m.email=u.email, m.isbn=b.isbn, m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END  WITH u, b, m "

		set_clause = "SET u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constant::InteractionPoint::ReadTime.to_s+" ELSE toInt(u.total_count) + "+Constant::InteractionPoint::ReadTime.to_s+" END"

		clause = rating_clause + _delete_existing_feednext_clause(@user_id) + _feednext_clause(@user_id) + _bookfeed_clause(@user_id) + _existing_ego_clause + _ego_clause + set_clause
		puts "TIMER".green
		clause
	end

	def self.recommend(friend_id)
		total_count = "SET u.total_count = CASE WHEN u.total_count IS NULL THEN 1 ELSE u.total_count + "+Constant::InteractionPoint::RecommendationPoints.to_s+" END "
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

	def create_borrow_node
		" MERGE (user) -[:BorrowItem]->(borrow_node:BorrowNode{book_id:" + @book_id.to_s + ", user_id:" + @user_id.to_s +  "})"\
		"SET borrow_node.timestamp =\'" + Time.now.to_i.to_s + "\' "\
		" WITH user, borrow_node "
	end

	def notify_borrow
		User.new(@user_id).match + UsersUser.match_followers + create_borrow_node + ", friend " + "WITH friend as user, borrow_node " + 	User::UserNotification.add("borrow_node")
	end

	def self.merge_reading_journey
		" MERGE (user:User)-[has_reading_journey:HasReadingJourney]->(reading_journey:ReadingJourney{user_id: ID(user), book_id: ID(book)})-[for_book:ForBook]->(book) WITH user, book, reading_journey "
	end

	def self.optional_match_recent_reading_status
		 " OPTIONAL MATCH (reading_journey)-[next_status:NextStatus]->(recent_status)  FOREACH (ignore IN CASE WHEN next_status IS NULL THEN [1] ELSE [] END | MERGE (reading_journey)-[next_status:NextStatus]->(reading_journey) ON CREATE SET reading_journey.timestamp = 0) WITH user, book, reading_journey, rec WITH user, book, reading_journey, recent_status "
	end

	def self.link_reading_journey user_id
		User.new(user_id).match + ", book " + UsersBook.merge_reading_journey + UsersBook.optional_match_recent_reading_status 
	end

	def self.match_reading_journey_id id
		" MATCH (reading_journey)-[next_status:NextStatus]->(recent_status) WHERE ID(reading_journey) = " + id + " WITH reading_journey, recent_status, next_status "
	end

	def self.create_progress reading_journey_info, progress
		clause = " "
		nodes = []
		if progress.exist?
			progress = progress.sort_by{ |hsh| hsh["percent_complete"] }
			progress.each_with_index do |step, index|
				if (step["timestamp"].to_i > reading_journey_info['timestamp'].to_i)
					nodes << "node#{index}"
					clause += " CREATE (node#{index}{percent_complete: " + step['percent_complete'].to_s + ", timestamp: " + step['timestamp'].to_s + " }) MERGE (node#{index})-[:NextStatus]->(#{nodes[-2]}) WITH " + nodes.join(", ")
				end
			end

			clause += UsersBook.match_reading_journey_id(reading_journey_info['id']) + ", " + nodes.join(", ") + " DELETE next_status MERGE (#{nodes.first})-[:NextStatus]->(recent_status) MERGE (reading_journey)-[:NextStatus]->(#{nodes.last}) "
		end
	end
end