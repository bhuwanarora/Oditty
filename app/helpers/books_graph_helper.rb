 module BooksGraphHelper

	def self.neo_init
		@neo = Neography::Rest.new
	end

	def self.create_thumb_request(params, user_id)
		book_id = params[:book_id]
		thumb_url = params[:thumb_url]
		@neo ||= self.neo_init
		thumb_request_clause = "MATCH (u:User), (b:Book) WHERE ID(u)="+user_id.to_s+" AND ID(b) = "+book_id.to_s+" CREATE UNIQUE (u)-[:DataEdit]->(t:ThumbRequest{url: \""+thumb_url+"\", user_id: "+user_id.to_s+", book_id: "+book_id.to_s+"})-[:DataEditRequest]->(b) SET t.name=u.name, t.email=u.email, t.thumb=u.thumb, t.title=b.title, t.author_name=b.author_name, t.isbn=b.isbn, t.timestamp = "+Time.now.to_i.to_s+" WITH u, b, t "

		feednext_clause = "MATCH (u)-[old:FeedNext]->(old_feed) CREATE UNIQUE (u)-[:FeedNext{user_id:"+user_id.to_s+"}]->(t)-[:FeedNext{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, t "

		bookfeed_clause = "MATCH (b)-[old:BookFeed]->(old_feed) CREATE UNIQUE (b)-[:BookFeed{user_id:"+user_id.to_s+"}]->(t)-[:BookFeed{user_id:"+user_id.to_s+"}]->(old_feed) DELETE old WITH u, b, t "

		existing_ego_clause = "OPTIONAL MATCH (u)<-[:Follow]-(f:User) OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(f)}]->(u)-[r2:Ego{user_id:ID(f)}]->(x2) FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(f)}]->(x2) DELETE s, t)) WITH u, b, f "

		ego_clause = "OPTIONAL MATCH (f)-[old:Ego{user_id:ID(f)}]->(old_ego) FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN f IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(u)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) WITH DISTINCT u, b "

		clause = thumb_request_clause + feednext_clause + bookfeed_clause + existing_ego_clause + ego_clause
		puts clause.blue.on_red
		@neo.execute_query(clause)["data"]
	end

	def self.approve_thumb_request(status, id)
		@neo ||= self.neo_init
		clause = "MATCH (u:User)-[r1:DataEdit]->(t:ThumbRequest)-[r2:DataEditRequest]->(b:Book) WHERE ID(t)="+id.to_s+" SET t.status = "+status.to_s+", b.external_thumb = CASE WHEN "+status.to_s+" = 1 THEN t.url ELSE null END"
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	# ************************************************

	# MATCH (b:Book)-[:BookFeed*0..]->(news_feed)
	# WHERE ID(b)=BOOK_ID
	# RETURN labels(news_feed), news_feed

	# ************************************************
	
	def self.get_feed book_id
		@neo ||= self.neo_init
		clause = "MATCH (b:Book)-[:BookFeed*0..]->(news_feed) WHERE ID(b)="+book_id.to_s+" RETURN labels(news_feed), news_feed"
		puts clause.blue.on_red
		@neo.execute_query(clause)["data"]
	end

	# ************************************************

	# MATCH (b:Book), (u:User)
	# WHERE ID(b)=BOOK_ID AND ID(u)=USER_ID
	# WITH b
	# OPTIONAL MATCH (u)-[:RatingAction]->(rn:RatingNode)-[:Rate]->(b)  
	# OPTIONAL MATCH (u)-[:TimingAction]->(tm:TimingNode)-[:Timer]->(b)
	# RETURN b, rn.rating, tm.time_index

	# ************************************************
	def self.get_details(book_id, user_id=nil)
		@neo = Neography::Rest.new
		if user_id
			clause = "MATCH (b:Book), (u:User) WHERE ID(b)="+book_id.to_s+" AND ID(u)="+user_id.to_s+" WITH u, b OPTIONAL MATCH (u)-[:RatingAction]->(rn:RatingNode)-[:Rate]->(b) OPTIONAL MATCH (u)-[:TimingAction]->(tm:TimingNode)-[:Timer]->(b) OPTIONAL MATCH (u)-[:Labelled]->(l1:Label) OPTIONAL MATCH (u)-[:Labelled]->(l2:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(b) OPTIONAL MATCH (u)-[:MarkAsReadAction]->(m)-[:MarkAsRead]->(b), (u)-[:Follow]->(friend:User)-[:MarkAsReadAction]->(m_friend)-[:MarkAsRead]->(b) RETURN b, rn.rating, tm.time_index, COLLECT(DISTINCt l1.name) as labels, COLLECT(DISTINCT l2.name) as selected_labels, m.timestamp as mark_as_read, COLLECT(ID(friend)), COLLECT(friend.thumb), COUNT(friend)"
			puts clause.blue.on_red
			book = @neo.execute_query(clause)["data"][0]
		else
			clause = "MATCH (book:Book) WHERE ID(book)="+book_id.to_s+" RETURN book"
			puts clause.blue.on_red
			book = @neo.execute_query(clause)["data"][0][0]["data"]
		end
		book
	end

	def self.get_quick_reads(book_id, user_id=nil)
		@neo = Neography::Rest.new
		clause ="MATCH (book:Book)-[:WithReadingTime]->(rt:ReadingTime{page_count_range: '<50'}) RETURN book.isbn, ID(book) LIMIT 10"
		@neo.execute_query(clause)["data"]
	end
end