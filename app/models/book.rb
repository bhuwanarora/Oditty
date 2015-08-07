class Book < Neo
	def initialize id
		@id = id
	end

	def self.search_by_fb_id id
		" MATCH (book:Book :FacebookBook) WHERE book.fb_id = " + id.to_s + " WITH book "
	end

	def self.init_match
		" MATCH (book:Book) "
	end

	def self.optional_match_published_year
		" OPTIONAL MATCH (book:Book)-[:Published_in]->(year:Year) WITH book, year "
	end

	def self.match_in_range min_id,max_id
		" MATCH (book:Book) WHERE ID(book) >=" + min_id.to_s + " AND ID(book) <=" + max_id.to_s + " "
	end

	def self.search_by_indexed_title indexed_title
		" START book=node:node_auto_index('indexed_title:\""+indexed_title+"\"') WITH book " 
	end

	def self.search_by_unique_index unique_index
		" MATCH(book:Book{unique_index:\""+unique_index+"\"}) WITH book " 
	end

	def self.search_by_unique_indices unique_indices
		clause = " MATCH (book:Book) WHERE "\
			"" + unique_indices.map{|unique_index| ("book.unique_index = \"" + unique_index + "\"")}.join(" OR ")
		clause += " WITH book "
	end

	def self.search_by_legacy_indexed_title indexed_title
		" MATCH (book:Book{indexed_title:\""+indexed_title+"\"}) WITH book " 
	end

	def self.get_by_indexed_title indexed_title
		" START book=node:node_auto_index('indexed_title:\""+indexed_title+"\"') " + Book.return_init + Book.basic_info
	end	

	def self.get_by_unique_index unique_index
		" MATCH(book:Book{unique_index:\""+unique_index+"\"}) " + Book.return_init + Book.basic_info
	end

	def self.get_by_legacy_indexed_title indexed_title
		Book.search_by_legacy_indexed_title(indexed_title) + Book.return_init + Book.basic_info
	end	

	def get_feed
		" MATCH (book:Book)-[:BookFeed*0..]->(news_feed) WHERE ID(book) = " + @id.to_s + " RETURN labels(news_feed), news_feed "
	end

	def match_author
		" MATCH (author:Author)-[:Wrote]->(book) WITH author, book "
	end

	def self.set_bookmark_count operation
		if operation == "+"
			" SET book.bookmark_count = TOINT(COALESCE(book.bookmark_count, 0)) + 1 "
		else
			" SET book.bookmark_count = TOINT(COALESCE(book.bookmark_count, 1)) - 1 "
		end
	end

	def match node_variable="book"
		" MATCH ("+ node_variable + ":Book) WHERE ID("+ node_variable + ")=" + @id.to_s + " WITH "+ node_variable + " "
	end

	def get_basic_info
		match + Book.return_group(Book.basic_info)
	end

	def self.basic_info
		" ID(book) AS book_id, book.isbn AS isbn, book.title AS title, book.author_name AS author_name, book.page_count AS page_count, book.published_year AS published_year, TOINT(book.total_weight) as popularity, labels(book) AS label "
	end

	def self.get_book_by_isbn isbn
		" MATCH (book:Book) WHERE book.isbn =~\'.*" + isbn.to_s.strip + ".*\' "\
		" WITH book "
	end

	def self.get_books_by_isbn isbn_array
		" MATCH (book:Book) WHERE " + isbn_array.map{|isbn| ( "book.isbn =~\'.*" + isbn.to_s.strip + ".*\'")}.join(" OR ") + ""\
		" WITH book "
	end

	def get_display_info
		match + match_author + Book.return_group(Book.basic_info, " book.description AS description", "ID(author) AS author_id")
	end

	def self.grouped_basic_info
		" id: ID(book), isbn: book.isbn, title: book.title, author_name: book.author_name, page_count: book.page_count, published_year: book.published_year, popularity: TOINT(book.total_weight) "
	end

	def self.match_genre
		" MATCH (book)-[belongs_to:Belongs_to]->(genre:Genre) "
	end

	def set_total_page_count
		match + " FOREACH (ignore IN (CASE WHEN HAS(book.total_page_count) THEN [] ELSE [1] END) | SET book.total_page_count = " + total_page_count.to_s + " "\
			")"
	end

	def self.optional_match_genre
		" OPTIONAL " + Book.match_genre
	end

	def self.get_small_reads
		Book::SmallRead.path_nodes + self.return_group(Book.basic_info)
	end

	def self.match_path relation, limit
		"MATCH path = (book)-[:" + relation.to_s + "*" + limit.to_s + "]->(last_in_path)"
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
		 " MATCH (book)-[from_category:FromCategory]->(category:Category)-[has_root:HasRoot*0..1]->(root_category:Category{is_root:true}) WITH DISTINCT(book) as book, COLLECT(DISTINCT("+Category::Root.grouped_basic_info+")) as root_category "
	end

	def self.optional_match_root_category
		" OPTIONAL "+self.match_root_category
	end

	def self.order_desc
		" ORDER BY TOINT(book.total_weight) DESC "
	end

	def self.get_complete_info
		UsersBook::Rate.optional_match + UsersBook::Endorse.optional_match + Book.optional_match_root_category + Book.return_group(Book.detailed_info, "rating_node.rating AS user_rating", " ID(endorse) AS endorse_status", " COLLECT(ID(root_category)) AS root_category_ids ")
	end

	def self.set_endorse_count operation
		if operation == "+"
			" SET book.endorse_count = TOINT(COALESCE(book.endorse_count, 0)) + 1 " 
		else
			" SET book.endorse_count = TOINT(COALESCE(book.endorse_count, 1)) - 1 " 
		end
	end

	def self.set_rating_count operation
		if operation == "+"
			" SET book.rating_count = TOINT(COALESCE(book.rating_count, 0)) + 1 "
		else
			" SET book.rating_count = TOINT(COALESCE(book.rating_count, 1)) - 1 "
		end
	end

	def self.match_communities 
		" MATCH (community:Community)-[:RelatedBooks]->(book) WITH community, book "
	end

	def self.grouped_news_community
		" WITH community, " + Book		
	end

	def get_news skip_count = 0
		#TODO: Change sorting of community.
		match + Book.match_communities + Community.order_desc + Book.limit(1) + Community.match_news  + " ,book " + News.order_desc  + Book.skip(skip_count) + Book.limit(10) +  " WITH book, " + Community.collect_map("news" => News.grouped_basic_info) + Book.match_communities + " ,news " + Community.order_desc + Book.return_init + " news, " + Community.collect_map("communities" => Community.grouped_basic_info)
	end

	def self.match_lenders 
		Status::BookExchangeStatusType::PlanningToLend.new(@id).match + ", friend " + Status.match + " , friend " + UsersUser.match_all
	end

	def get_lenders user_id
		User.new(user_id).match + " WITH user AS friend " + match + " , friend " + Book.match_lenders + Book.return_init + User.basic_info   
	end

	def self.remove_unauthored_books
		clause = "MATCH (b: Book) WHERE NOT(HAS(b.author_name)) WITH b"\
		"MATCH (b)-[r]-() REMOVE b,r"
	end
	
	def get_interesting_info
		match + " MATCH (book)-[relation]-(info) WHERE type(relation) <> 'Belongs_to' AND type(relation) <> 'NextBook' AND type(relation) <> 'BookFeed' AND type(relation) <> 'NextLongRead' AND type(relation) <> 'NextNormalRead' AND type(relation) <> 'NextTinyRead' AND type(relation) <> 'NextSmallRead' AND type(relation) <> 'BookmarkNode'" + Book.return_group(Book.basic_info, "COLLECT({info : info, labels: labels(info), id: ID(info)}) AS info")
	end

	def self.get_out_relationship relationship_type,book
		"MATCH ("+book+":Book)-[relation:"+relationship_type+"]->(node) WITH "+book+",relation,node "
	end

	def self.get_in_relationship relationship_type,book
		"MATCH ("+book+":Book)<-[relation:"+relationship_type+"]-(node) WITH "+book+",relation,node "
	end

	def self.get_max_min_id
		output = "MATCH (a:Book) RETURN max(ID(a)) as max_id,min(ID(a)) as min_id".execute[0]
		[output["max_id"],output["min_id"]]
	end
	
	def self.create_in_relation node1,node2,relationship_type,properties
		clause = "CREATE("+node1+")<-[r:"+relationship_type+"]-("+node2+") "
		properties.each do |key,value|
			clause += "SET r."+key+" = "+value+" "
		end
		clause
	end

	def self.create_out_relation node1,node2,relationship_type,properties
		clause = "CREATE("+node1+")-[r:"+relationship_type+"]->("+node2+") "
		properties.each do |key,value|
			clause += "SET r."+key+" = "+value+" "
		end
		clause
	end

	def self.primary_info
		" book.title AS title, book.author_name AS author_name, ID(book) AS id "
	end

	def get_primary_info
		match + match_author + Book.return_group(Book.primary_info, "ID(author) as author_id")
	end

	def self.get_book_links
		book_links_property={"Wrote"=> [], # These are the inlinks.	
				"Published_in"	 => [],
				"MovieBased"     => [],
				"FromCategory"   => [],
				"ReadingLevel"   => [],
				"Eversion"       => [],
				"BookFeed"		 => [],				
				"NextNormalRead" => [],
				"BookmarkAction" => [],
				"NextLongRead"   => [],
				"NextSmallRead"  => [],
				"Rate"           => [],
				"NextTinyRead"   => [],				
				"RelatedBooks"   => [],
				"Belongs_to"     => ["weight"],				
				"Mentions"       => [],
				"Endorsed"		 => [],
				"FeedNext"       => [],
				"NextBook"      => []
				}
		book_links_property
	end
	
	def self.set_recommended_count value, operation
		if operation == "+"
			" SET book.recommended_count = TOINT(COALESCE(book.recommended_count, 0)) + " + value.to_s + " "
		else
			" SET book.recommended_count = TOINT(COALESCE(book.recommended_count, " + value.to_s + ")) - " + value.to_s + " "
		end
	end

	def self.set_facebook_book id
		" SET book :FacebookBook, book.fb_id = " + id.to_s + " "
	end
end