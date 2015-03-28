class Book < Neo
	def initialize id
		@id = id
	end

	def get_feed
		" MATCH (book:Book)-[:BookFeed*0..]->(news_feed) WHERE ID(book) = " + @id.to_s + " RETURN labels(news_feed), news_feed "
	end

	def set_bookmark_count operation
		" SET book.bookmark_count = COALESCE(book.bookmark_count,0) " + operation.to_s + " 1 "
	end

	def match
		" MATCH (book:Book) WHERE ID(book)=" + @id.to_s + " WITH book "
	end

	def self.basic_info
		" ID(book) AS book_id, book.isbn AS isbn, book.title AS title, book.author_name AS author_name, book.pages_count AS pages_count, book.published_year AS published_year, TOINT(book.total_weight) as popularity"
	end

	def self.rating
		", rating_node.rating AS user_rating"
	end

	def self.match_genre
		" MATCH (book)-[belongs_to:Belongs_to]->(genre:Genre) "
	end

	def self.optional_match_genre
		" OPTIONAL " + self.match_genre
	end

	def self.get_small_reads
		Book::SmallRead.path_nodes + self.return_group(Book.basic_info)
	end

	def self.match_path relation, limit
		"MATCH path = (book)-[:" + relation.to_s + "*" + limit.to_s + "]-(last_in_path)"
	end

	def get_categories
		match_clause = " MATCH (book) WHERE ID(book) = " + @id.to_s + " MATCH (book)-[:FromCategory]->(:Category)-[:HasRoot*0..1]->(root_category{is_root:true}) RETURN "
		limit_clause = " LIMIT 5"
		clause = match_clause + Category.return_clause  + limit_clause
		clause
	end

	def self.detailed_info
		self.basic_info + ", book.readers_count as readers_count, book.bookmark_count as bookmark_count, book.comment_count as comment_count, book.description as description, book.external_thumb as external_thumb "
	end

	def self.match_root_category
		 " MATCH (book)-[from_category:FromCategory]->(category:Category)-[has_root:HasRoot*0..1]->(root_category:Category{is_root:true}) "
	end

	def self.order_desc
		" ORDER BY book.total_weight DESC "
	end

	def complete_info user_id
		# if user_id
		# 	clause = UsersBook.new(@id, user_id) + " OPTIONAL MATCH (u)-[:RatingAction]->(rn:RatingNode)-[:Rate]->(b) OPTIONAL MATCH (u)-[:TimingAction]->(tm:TimingNode)-[:Timer]->(b) OPTIONAL MATCH (u)-[:Labelled]->(l1:Label) OPTIONAL MATCH (u)-[:Labelled]->(l2:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(b) OPTIONAL MATCH (u)-[:MarkAsReadAction]->(m)-[:MarkAsRead]->(b) OPTIONAL MATCH (u)-[:EndorseAction]->(e)-[:Endorsed]->(b) OPTIONAL MATCH (u)-[:Follow]->(friend:User)-[:MarkAsReadAction]->(m_friend)-[:MarkAsRead]->(b) OPTIONAL MATCH (b)-[bt:Belongs_to]->(g:Genre) RETURN " + return_book_data + ", rn.rating as user_rating, tm.time_index as user_time_index, COLLECT(DISTINCT l1.name) as labels, COLLECT(DISTINCT l2.name) as selected_labels, m.timestamp as status, ID(e) as endorse_status, COLLECT(ID(friend)) as friends_id, COLLECT(friend.thumb) as friends_thumb, COUNT(friend) as friends_count, COLLECT(g.name) as genres, COLLECT(bt.weight) as genres_weight"
		# else
		# end
		match + Book.return_init + Book.detailed_info
	end

end