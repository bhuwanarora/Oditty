module GraphHelper
	def self.curate_author_names
		get_ids_range_clause = " MATCH (node:Author) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		range = get_ids_range_clause.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		puts maximum
		puts minimum
		range = (maximum - minimum) / 500
		while minimum < maximum
			clause = "MATCH (author:Author) WHERE ID(author) <= #{minimum + range} AND ID(author) >= #{minimum} AND author.name=~'@.*' SET author.name = SUBSTRING(author.name, 1) "	
			clause.execute
			minimum += range
		end
	end

	def self.fix_feed user_id
		clause = " MATCH (feed:Feed{user_id:" + user_id.to_s + "}), user WHERE ID(user) = " + user_id.to_s + " OPTIONAL MATCH (feed)-[r:FeedNext]-() DELETE r WITH feed, user ORDER BY feed.updated_at DESC WITH user, COLLECT(feed) AS feeds  FOREACH(i in RANGE(0, length(feeds)-2) |  FOREACH(p1 in [feeds[i]] |  FOREACH(p2 in [feeds[i+1]] |  MERGE (p1)-[:FeedNext{user_id:" + user_id.to_s + " }]->(p2)))) WITH user, LAST(feeds) AS last, HEAD(feeds) AS head  MERGE (last)-[:FeedNext{user_id:" + user_id.to_s + " }]->(user)-[:FeedNext{user_id:" + user_id.to_s + " }]->(head) " + User.return_group(User.basic_info)
		clause.execute
	end

	def self.set_book_feed
		(end_id,start_id) = Book.get_max_min_id
		step_count = 10000
		book_feed_key = "book_feed_key"
		if(!$redis[book_feed_key].nil?)
			cur_id = $redis[book_feed_key].to_i
		else
			cur_id = start_id
			$redis[book_feed_key] = cur_id -1
		end
		clause = " OPTIONAL MATCH (book:Book)-[f:BookFeed]->() "\
			"FOREACH (book IN (CASE WHEN f IS NULL THEN [book] ELSE [] END )| "\
				"CREATE UNIQUE (book)-[:BookFeed]->(book) "\
				" ) "
		while cur_id <= end_id
			temp_clause = Book.match_in_range cur_id,(cur_id + step_count)
			temp_clause += clause
			temp_clause.execute
			$redis[book_feed_key] = cur_id
			cur_id += step_count
		end
	end

	def self.detect_broken_feed user_id
		clause = "MATCH (user) WHERE ID(user) = " + user_id.to_s + " WITH user MATCH (user)-[r:FeedNext*1..]->(user) RETURN LENGTH(r) AS length, ID(user) AS id "
		response = clause.execute
		unless response.present? && response[0]["length"].present?
			GraphHelper.fix_feed user_id
		end
	end

	def self.user_set_bookmark_count
		clause = "MATCH (user:User) WITH user "\
			"OPTIONAL " + Bookmark.match_path("book") + "WHERE label.key <> \'" + Bookmark::Type::FromFacebook.get_key + "\' AND label.key <> \'" + Bookmark::Type::Visited.get_key + "\' "\
			" WITH user, COUNT(DISTINCT(bookmark_node)) as bookmark_node_count "\
				"SET user.bookmark_count = bookmark_node_count"
		clause.execute
	end

	def self.make_book_and_article_shelves
		clause = " MATCH (label: Label) SET label: BookShelf WITH label WHERE NOT (label.key = \"PlanToBuy\" OR label.key = \"IOwnThis\" OR label.key = \"IOwnthis\") WITH label SET label: ArticleShelf "
		clause.execute
	end

	def self.curate_books_author_name
		get_ids_range_clause = " MATCH (node:Book) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		range = get_ids_range_clause.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		puts maximum
		puts minimum
		range = (maximum - minimum) / 500
		while minimum < maximum
			clause = "MATCH (book:Book) WHERE book.author_name=~'@.*' AND ID(book) <= #{minimum + range} AND ID(book) >= #{minimum} SET book.author_name = SUBSTRING(book.author_name, 1) "	
			clause.execute
			minimum += range
		end
	end

	def self.set_region_news_count
		clause = " MATCH (region:Region) WITH region OPTIONAL MATCH (region)<-[:FromRegion]-(news:News) WITH DISTINCT region, COUNT(news) AS news_count SET region.news_count = COALESCE(news_count,0) "
		clause.execute
	end

	def self.set_category_linked_list
		# delete_clause = "MATCH ()-[r:NextInCategory]->() DELETE r"
		# delete_clause.execute

		starting_book_id = Constant::Id::BestBook.to_i
		match_clause = " MATCH (book) WHERE ID(book) = " + starting_book_id.to_s + " WITH book MATCH (last:Book)-[:NextBook]->(book) WITH book, last MATCH path = (book)-[:NextBook*1595212]->(last) "
		extract_clause = " WITH path, EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book WITH book WHERE NOT (book)-[:NextInCategory]-() "
		collect_categorised = Category::Root.match_books_root + " WITH DISTINCT root_category, COLLECT(book) AS books "
		create_links = " FOREACH(i in RANGE(0, length(books)-2) |  FOREACH(p1 in [books[i]] |  FOREACH(p2 in [books[i+1]] |  MERGE (p1)-[:NextInCategory{from_category:root_category.uuid}]->(p2)))) WITH root_category, HEAD(books) as most_popular, LAST(books) as least_popular MERGE (least_popular)-[:NextInCategory{from_category:root_category.uuid}]->(root_category) MERGE (root_category)-[:NextInCategory{from_category:root_category.uuid}]->(most_popular) "
		clause = match_clause + extract_clause + collect_categorised + create_links
		info = clause.execute[0]

		# clause = "MATCH (b:Book)-[r:NextBook]->() RETURN COUNT(b) AS count"
		# info = clause.execute[0]
		# puts info
	end

	def self.set_era_linked_list
		delete_clause = "MATCH ()-[r:NextInEra]->() DELETE r"
		delete_clause.execute

		starting_book_id = Constant::Id::BestBook.to_i
		match_clause = " MATCH (book) WHERE ID(book) = " + starting_book_id.to_s + " WITH book MATCH  (last:Book)-[:NextBook]->(book) WITH book, last MATCH path = (book)-[:NextBook*]->(last) " 
		extract_clause = " WITH path, EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book WITH book WHERE NOT (book)-[:NextInEra]-() "
		collect_categorised = Era.match_books + " WITH DISTINCT era, COLLECT(book) AS books "
		create_links = " FOREACH(i in RANGE(0, length(books)-2) |  FOREACH(p1 in [books[i]] |  FOREACH(p2 in [books[i+1]] |  MERGE (p1)-[:NextInEra{from_era:ID(era)}]->(p2)))) WITH era, HEAD(books) as most_popular, LAST(books) as least_popular MERGE (least_popular)-[:NextInEra{from_era:ID(era)}]->(era)-[:NextInEra{from_era:ID(era)}]->(most_popular) "		
		clause = match_clause + extract_clause + collect_categorised + create_links
		clause.execute
	end

	def self.set_day_linked_list
		clause = " MATCH (year:Year)-->(month:Month)-->(day:Day) WITH day ORDER BY (366*TOINT(year.year)+ 31*TOINT(month.month) + TOINT(day.day)) WITH COLLECT(day) AS days FOREACH(i in RANGE(0, length(days)-2) |  FOREACH(p1 in [days[i]] |  FOREACH(p2 in [days[i+1]] |  MERGE (p1)-[:NextDay]->(p2)))) "
		clause.execute
	end

	def self.set_blogs
		blogs_set = false
		set_root = " MERGE (root:Blog{is_root:true}) MERGE (root)-[:NextPost]->(root) SET root.posted_at = \" 2014-04-28T12:06:25+05:30 \" RETURN root "
		set_root.execute
		while !blogs_set
			latest_blog = Blog.get_latest_blog.execute[0]
			BlogsHelper.handle
			updated_latest_blog = Blog.get_latest_blog.execute[0]
			if latest_blog["blog_url"] == updated_latest_blog["blog_url"]
				blogs_set = true
			end
		end
	end

	def get_substring(start_string, end_string, clause)
      	clause[/#{start_string}(.*?)#{end_string}/m, 1]
	end


	def concat_new_index

		clause = "MERGE(b:Book{indexed_title:\"AWrinkleinTime\"}) SET b.name=\"A Wrinkle in Time\" "

		title_start_string = "indexed_title:\\\""

		title_end_string = "SET b.name="

		author_start_string = "Author{name:\\\""

		author_end_string = ", url:"



		title_string = get_substring(title_start_string, title_end_string, clause)[0..-3]

		author_name = get_substring(author_start_string, author_end_string, clause)

		indexed_author_name = search_ready(author_name)

		indexed_title_string = search_ready(title_string)

		str = title_start_string[0..-3] + "\"" + title_string
		p str
		if !indexed_author_name.empty? and !indexed_title_string.empty?
		      p clause.gsub(str, "unique_index:"+indexed_title_string + indexed_author_name + "\"}")
		end

	end

	def set_index
		clause = "MATCH (book: Book) return max(ID(book)) as id"
		maximum_node_id = 4938046
		count = 0
		clause = "MATCH (book: Book) return  min(ID(book))"
		minimum_node_id = 2578686 #2283294 #384294
		step_size = 1000

		for count in (minimum_node_id...maximum_node_id).step(step_size)
			clause = "MATCH (book: Book) where ID(book) >= #{count} AND ID(book) < #{count + step_size} WITH book WHERE (book.indexed_title IS NOT NULL OR book.indexed_title <> \"null\") AND (book.indexed_author_name IS NOT NULL OR book.indexed_author_name <> \"null\") SET book.unique_index = LOWER(book.indexed_title + SUBSTRING(book.indexed_author_name, 1)) RETURN book.unique_index"
			unique_index = clause.execute
			p unique_index
		end
	end

	def remove_wrongly_matched_books
		skip = 1000
		start_id = 384293 #MIN ID384296
		end_id = 2655796 #MAX ID2545256
		# limit = 100
		while start_id <= end_id
			puts "Start ID..."+start_id.to_s.green
			limit = start_id + skip
			clause = " MATCH (b:Book)<-[:Wrote]-(a:Author) WHERE b.author_name <> a.name AND ID(b) < "+limit.to_s+" AND ID(b) >= "+start_id.to_s+" RETURN COUNT(b) AS count"
			puts clause.execute[0]["count"]
			start_id = start_id + skip
		end	
	end

	def self.repliacate_links_optimized(clause_init, link_types,source,destination)
		output = 1
		left_to_execute =true
		limit_query_length = 100
		orig_id = 0
		dup_id = 0
		begin
			clause =clause_init
			arrows=[{:left => "",:right => ">"},{:left => "<",:right => ""}]			
			arrows.each do |arrow|
				clause =clause_init+"MATCH ("+source+")"+arrow[:left]+"-[rel]-"+arrow[:right]+"(node) "\
					"RETURN ID(rel) AS id_rel, ID(node) AS id_node, ID("+source+") AS id_source, ID("+destination+") AS id_dest, type(rel) as type_r "
				output_temp = clause.execute
				if(output_temp.length == 0)
					output = 0
					break
				end				
				clause = " MATCH ("+source+":Book), ("+destination+":Book) WHERE ID("+source+") ="+output_temp[0]["id_source"].to_s+" AND ID("+destination+") ="+output_temp[0]["id_dest"].to_s+" "			
				output_temp.each do |output|
					dup_id = output["id_source"]
					orig_id = output["id_dest"]
					left_to_execute = true
					clause += "WITH "+source+", "+destination+" "
					clause += "MATCH ("+source+")"+arrow[:left]+"-[rel]-"+arrow[:right]+"(node) "\
						"WHERE ID(rel) ="+output["id_rel"].to_s+" AND ID(node) = "+output["id_node"].to_s+" "\
						"WITH rel,node, "+source+", "+destination+" "
					clause += "MERGE ("+destination+")"+arrow[:left]+"-[new_relation:"+output["type_r"]+"]-"+arrow[:right]+"(node) "				
					if !link_types[output["type_r"]].nil?
						if(link_types[output["type_r"]].length >0)
							clause += "WITH rel,node, "+source+", "+destination+", new_relation "	
							link_types[output["type_r"]].each do |property|
								clause +="SET new_relation."+property +" = rel."+property+" "
							end					
						end
					else
						puts ("New LinkType Found: "+output["type_r"]).red 						
					end
					if (clause.length >limit_query_length)						
						clause.execute
						left_to_execute =false
						clause = "MATCH ("+source+":Book), ("+destination+":Book) WHERE ID("+source+") ="+output["id_source"].to_s+" AND ID("+destination+") ="+output["id_dest"].to_s+" "					
					end
				end				
				if left_to_execute == true					
					clause.execute	
					left_to_execute =false		
				end			
			end
			
		rescue Exception => e
			output = -1
			puts e.message.red
		end
		[output,orig_id,dup_id]
	end


		# This function deletes the duplicate books. Duplicacy is on the basis of unique-index
	def self.delete_duplicate_books_unique_index
		end_id_author, start_id_author = Author.get_max_min_id
		book_links_property = Book.get_book_links		
		step_size = 500
		author_id_key = 'author_id'
		if(!$redis[author_id_key].nil?)			
			cur_id = $redis[author_id_key].to_i
		else			
			cur_id = start_id_author
			$redis[author_id_key] = cur_id -1
		end		
		while cur_id <=end_id_author
			upper_limit = cur_id+step_size			
			clause_init = "MATCH (n: Author)-[:Wrote]->(book: Book), (n)-[:Wrote]->(dup_book: Book)"\
				"WHERE ID(n)>= "+cur_id.to_s+" AND ID(n) <= "+upper_limit.to_s+" AND NOT(HAS(book.to_be_deleted)) AND "\
				"dup_book.unique_index = book.unique_index AND ID(dup_book) <> ID(book) "\
				"AND dup_book.indexed_author_name = book.indexed_author_name "\
				"WITH dup_book, book LIMIT 1 "
			output, orig_id, dup_id = repliacate_links_optimized(clause_init, book_links_property, "dup_book", "book")			
			if (output == 1)				
				dup = ("MATCH (dup:Book) WHERE  ID(dup) = "+dup_id.to_s+" RETURN dup").execute[0]["dup"]["data"]
				clause = "MATCH (orig:Book),(dup:Book) WHERE ID(orig) = "+orig_id.to_s+"  AND ID(dup) = "+dup_id.to_s+" WITH orig, dup "
				dup.keys.each do |prop|
					if (dup[prop].is_a? String)
						clause += ", (CASE WHEN (not(has(orig."+prop+")) OR length(orig."+prop+") <length(dup."+prop+")) THEN dup."+prop+" ELSE orig."+prop+" END) AS "+prop+" "
					else
						clause += ", (CASE WHEN (not(has(orig."+prop+"))) THEN dup."+prop+" ELSE orig."+prop+" END) AS "+prop+" "
					end					
				end
				dup.keys.each do |prop|
					clause += "SET orig."+prop+" = "+prop+" "					
				end 
				clause += "WITH dup MATCH (dup)-[r]-() DELETE dup,r"				
				clause.execute				
			elsif(output == 0)				
				cur_id += step_size				
				$redis[author_id_key] = cur_id
			end		
		end
	end

	def self.same_property(node1,node2,prop)
		"(" + node1 + "." + prop +" = " + node2 + "." + prop +")"
	end
	def self.not_has(node, property)
		"(NOT(has(" +node + "." + property + ")))"		
	end

	def self.match_duplicate_authors_conditions (original, duplicate)
		"(" +GraphHelper.same_property(original,duplicate,"gr_url") + " OR "\
		"((" + GraphHelper.not_has(original,"gr_url") + " OR " + GraphHelper.not_has(duplicate,"gr_url") + ") AND " + GraphHelper.same_property(original,duplicate,"url") + ")  OR "\
		"((" + GraphHelper.not_has(original,"gr_url") + " OR " + GraphHelper.not_has( duplicate,"gr_url") + ") AND (" + GraphHelper.not_has(original,"url") + " OR " + GraphHelper.not_has( duplicate,"url") + ") AND (" +GraphHelper.same_property(original,duplicate,"wiki_url") + "))) "
	end
	
	def self.set_original_author_properties (original, duplicate)
		clause = ""\
		" OPTIONAL MATCH(" + duplicate + ")-[wrote:Wrote]->(books:Book) "\
		" FOREACH (book in ( CASE WHEN books IS NULL THEN [] ELSE [books] END)| "\
		" MERGE(" + original + ")-[:Wrote]->(book)" \
		" ) "\
		" DELETE wrote "\
		" WITH " + original + "," + duplicate + " "\
		" "\
		" OPTIONAL MATCH(" + duplicate + ")<-[is_about:IsAbout]-(blogs:Blog) "\
		" FOREACH (blog in ( CASE WHEN blogs IS NULL THEN [] ELSE [blogs] END)| "\
		" MERGE(" + original + ")<-[:IsAbout]-(blog)" \
		" ) "\
		" DELETE is_about "\
		" WITH " + original + "," + duplicate + " "\
		" "\
		" OPTIONAL MATCH(" + duplicate + ")-[answered:Answered]->(questions:Question) "\
		" FOREACH (question in ( CASE WHEN questions IS NULL THEN [] ELSE [questions] END)| "\
		" MERGE(" + original + ")-[:Answered]->(question)" \
		" ) "\
		" DELETE answered "\
		" WITH " + original + "," + duplicate + " "\
		" "\
		" OPTIONAL MATCH (question)-[answerof:AnswerOf{author_id: ID(" + duplicate + ")}]-(answer) "\
		" FOREACH (answer IN (CASE WHEN answerof IS NULL THEN [] ELSE [answerof] END)| "\
			" SET answerof.author_id = ID(" + original + ") "\
		") "\
		" WITH " + original + ", " + duplicate + " "\
		" "\
		" OPTIONAL MATCH(" + duplicate + ")<-[follows:OfAuthor]-(followsnodes:FollowsNode) "\
		" FOREACH (followsnode in ( CASE WHEN followsnodes IS NULL THEN [] ELSE [followsnodes] END)| "\
		" MERGE(" + original + ")<-[:OfAuthor]-(followsnode) " \
		" ON CREATE SET " + original + ".follow_count = CASE WHEN " + GraphHelper.not_has("original","follow_count") + "THEN 1 ELSE " + original + ".follow_count + 1 END, "\
		" followsnode.author_id = ID(" + original + ") "\
		" ) "\
		" DELETE follows "\
		" WITH " + original + "," + duplicate + " "\
		" OPTIONAL MATCH (" + duplicate + ")-[r]-() "\
		" DELETE "+ duplicate + ",r "\
		" RETURN ID(original) AS id"
		clause
		
	end
	def self.copy_properties_author(original_id,duplicate_id)
		dup = ("MATCH (duplicate:Author) WHERE ID(duplicate) = " + duplicate_id.to_s + " RETURN duplicate").execute[0]["duplicate"]["data"]
		clause = "MATCH (orig:Author),(dup:Author) WHERE ID(orig) = " + original_id.to_s + "  AND ID(dup) = "+duplicate_id.to_s+" WITH orig, dup "
		dup.keys.each do |prop|
			if (dup[prop].is_a? String)
				clause += ", (CASE WHEN (not(has(orig."+prop+")) OR length(orig."+prop+") <length(dup."+prop+")) THEN dup."+prop+" ELSE orig."+prop+" END) AS "+prop+" "
			else
				clause += ", (CASE WHEN (not(has(orig."+prop+"))) THEN dup."+prop+" ELSE orig."+prop+" END) AS "+prop+" "
			end					
		end
		dup.keys.each do |prop|
			clause += "SET orig."+prop+" = "+prop+" "					
		end 		
		clause.execute
	end

	def self.merge_duplicate_authors_in_range_auto_index(starting_regex)
		puts "Removing duplicate authors with search_index starting with: " + starting_regex
		clause = "START original=node:node_auto_index('indexed_main_author_name:" + starting_regex +"*" + "')  WITH original "\
			"START duplicate = node:node_auto_index('indexed_main_author_name:" + starting_regex +"*" + "') "\
			"WHERE ( (ID(original) <> ID(duplicate)) "\
			"AND " + GraphHelper.match_duplicate_authors_conditions("original","duplicate") + " ) "\
				" RETURN ID(original),ID(duplicate) LIMIT 1"
		output = clause.execute
		if (output.length >0)
			id_orig = output[0]["ID(original)"]
			id_dup = output[0]["ID(duplicate)"]
			GraphHelper.copy_properties_author(id_orig,id_dup)
			clause = "MATCH (original:Author),(duplicate:Author) WHERE "\
				"ID(original) = " + id_orig.to_s + " AND ID(duplicate) = " + id_dup.to_s + " "\
				"WITH original,duplicate  "\
				"" + GraphHelper.set_original_author_properties("original","duplicate")
			output = clause.execute
		end
		if(output.nil? || output.length == 0 || !(output[0].keys.include? "id"))
			matched = 0
		else
			matched = 1
		end
		matched
	end

	def self.merge_duplicate_authors_in_range(starting_regex)
		puts "Removing duplicate authors with search_index starting with: " + starting_regex
		clause = "MATCH (original:Author),(duplicate:Author) WHERE ("\
				"(original.search_index =~" + "\'" + starting_regex + ".*\'" + ") AND (duplicate.search_index =~ " + "\'" + starting_regex + ".*\'" + ")  AND (ID(original) <> ID(duplicate)) "\
				"AND " + GraphHelper.match_duplicate_authors_conditions("original","duplicate") + " ) "\
				" RETURN ID(original),ID(duplicate) LIMIT 1"
		output = clause.execute		
		if (output.length >0)
			id_orig = output[0]["ID(original)"]
			id_dup = output[0]["ID(duplicate)"]
			GraphHelper.copy_properties_author(id_orig,id_dup)
			clause = "MATCH (original:Author),(duplicate:Author) WHERE "\
				"ID(original) = " + id_orig.to_s + " AND ID(duplicate) = " + id_dup.to_s + " "\
				"WITH original,duplicate  "\
				"" + GraphHelper.set_original_author_properties("original","duplicate")		
			output = clause.execute
		end
		if(output.nil? || output.length == 0 || !(output[0].keys.include? "id"))
			matched = 0
		else
			matched = 1
		end
		matched
	end
	
	def self.next_regex(first_letter, second_letter, third_letter)
		if (third_letter == 'z')
			third_letter = 'a'
			if(second_letter == 'z')
				first_letter = first_letter.ord.next.chr
				second_letter = 'a'
			else
				second_letter = second_letter.ord.next.chr
			end
		else
			third_letter = third_letter.ord.next.chr
		end
		[first_letter,second_letter, third_letter]
	end

	def self.merge_duplicate_authors		
		author_id_key = 'dup_author_regex'		
		if(!$redis[author_id_key].nil?)			
			cur_state = $redis[author_id_key]
			fl = cur_state[0]
			sl = cur_state[1]
			tl = cur_state[2]
		else
			$redis[author_id_key] = "aaa"
			fl = "a"
			sl = "a"
			tl = "a"
		end
		while (!(fl == 'z' && sl == 'z' && tl == 'z'))
			matched = GraphHelper.merge_duplicate_authors_in_range_auto_index("" + fl + sl + tl)
			if(matched == 0 )				
				(fl,sl,tl) = GraphHelper.next_regex(fl,sl,tl)
				$redis[author_id_key] = "" + fl + sl + tl
			end
		end
	end

	def update_follow_counts_for_user
		clause = UsersUser.match + " WITH user, COUNT(DISTINCT(friend)) as follows_count "\
		" SET user.follows_count = follows_count "
		clause.execute
	end

	def update_followed_by_counts_for_user
		clause = UsersUser.match + " WITH friend, COUNT(DISTINCT(user)) as followed_by_count "\
		" SET friend.followed_by_count = followed_by_count "
		clause.execute
	end

	def self.set_author_feed
		clause = "MATCH (author:Author) MERGE (author)-[r4:AuthorFeedNext]->(author) "
		clause.execute
	end

	def self.set_author_books_count
		end_id_author, start_id_author = Author.get_max_min_id
		author_id_key = 'set_author_books_count'
		if(!$redis[author_id_key].nil?)
			cur_state = $redis[author_id_key]
			fl = cur_state[0]
			sl = cur_state[1]
		else
			$redis[author_id_key] = "aa"
			fl = "a"
			sl = "a"
		end

		while fl != "z" && sl != "z"
			clause = "START author=node:node_auto_index('indexed_main_author_name:" + fl + sl +"*" + "')  WITH author "\
				"MATCH (book:Book)<-[:Wrote]-(author:Author) "\
				"WITH COLLECT(DISTINCT(book)) AS books,author "\
				"SET author.books_count = CASE WHEN books IS NULL THEN 0 ELSE LENGTH(books) END "
			clause.execute
			(tl,fl,sl) = GraphHelper.next_regex("z",fl,sl)
			$redis[author_id_key] = "" + fl + sl
		end
	end

	def wrong_author_links
		clause = "MATCH (book:Book)<-[:Wrote]-(author:Author) WHERE book.author_name <> author.name RETURN COUNT(b)"
	end

	def set_user_notification
		clause = "MATCH (user:User) WITH user "\
			"WHERE NOT ((user)-[:NextNotification]->())"\
			"CREATE UNIQUE (user)-[:NextNotification]->(user)"
		clause.execute
	end

	def match_global_visited
		visited_string = Bookmark::Type::Visited.get_key
		" MATCH (global_visited:Label) WHERE HAS(global_visited.bookmark_count) AND global_visited.name = '" + visited_string + "' AND global_visited.basic = true AND global_visited.key = '" + visited_string + "' AND global_visited.public = false "\
		"WITH global_visited AS label "
	end

	def match_user_labelled
		" MATCH (user)-[labelled:Labelled]->(label:Label{key: \'" + Bookmark::Type::Visited.get_key + "\'}) " + " WHERE ID(label) <> ID(global_visited) "
	end

	def create_user_labelled
		visited_string = Bookmark::Type::Visited.get_key
		" MATCH (user)-[labelled:Labelled]->(label:Label{key: '" + visited_string + "'}) " + " WITH user, COUNT(label) as labelcount, COLLECT(label) AS labels, global_visited "\
		" WHERE labelcount = 1 "\
		" UNWIND labels AS label "\
		" WITH user, label, global_visited "\
		" WHERE ID(label) = ID(global_visited) "\
		" WITH user, global_visited "\
		" MERGE(user)-[labelled:Labelled]->(label_unique:Label{"\
			"key: '" + visited_string + "', "\
			"name: '" + visited_string + "', "\
			"public: false, "\
			"bookmark_count: 0}) "
	end

	def merge_label_bookmark_node_media
		" MERGE (bookmark_node: BookmarkNode{"\
			"label:\'" +Bookmark::Type::Visited.get_key + "\', "\
			"book_id:ID(media), "\
			"user_id: ID(user), "\
			"created_at: global_bookmark_node.created_at, "\
			"updated_at: global_bookmark_node.updated_at, "\
			"key: global_bookmark_node.key})-[bookmark_action:BookmarkAction]->(media) "\
			"ON CREATE SET bookmark_node.count = 0 "\
			"ON MATCH SET bookmark_node.count = global_bookmark_node.count "\
		" WITH user, label, global_visited, media, bookmark_node "\
		" MERGE (label)-[bookmarked_on:BookmarkedOn]->(bookmark_node) "
	end

	def merge_global_visited prev_clause
		visited_string = Bookmark::Type::Visited.get_key
		clause = prev_clause + match_global_visited + ", user " + Bookmark.match_path("media") + " "\
		" WITH user, label AS global_visited, media, bookmark_node AS global_bookmark_node " + match_user_labelled + " "\
		" WITH user, label, global_visited, global_bookmark_node, media "\
		"" + merge_label_bookmark_node_media + " RETURN DISTINCT ID(user) AS id "
		output = clause.execute
		if(output.length == 0)
			clause = prev_clause + match_global_visited + ", user " + Bookmark.match_path("media") + " "\
			" WITH DISTINCT user, label AS global_visited " + create_user_labelled + " "\
			" WITH user, label_unique, global_visited AS label "\
			"" + Bookmark.match_path("media") + ""\
			" WITH user, label AS global_visited, media, bookmark_node AS global_bookmark_node, label_unique AS label "\
			"" + merge_label_bookmark_node_media + " RETURN DISTINCT ID(user) AS id"
			output = clause.execute
		end
		if (output.length > 0)
			output = output[0]["id"]
		else
			output = nil
		end
		output
	end

	def remove_global_visited
		global_visited_key = "global_visited_key_jun26"
		output = User.get_max_min_id.execute
		min_id = output[0]["min_id"].to_i
		max_id = output[0]["max_id"].to_i
		if($redis[global_visited_key])
			cur_id = $redis[global_visited_key].to_i
		else
			cur_id = min_id
			$redis[global_visited_key] = cur_id - 1
		end
		while cur_id <= max_id
			clause = " MATCH (user:User) WHERE ID(user) >=" + cur_id.to_s + " "\
			"WITH user ORDER BY ID(user) LIMIT 1 "
			actual_id = merge_global_visited clause
			if(actual_id.present?)
				$redis[global_visited_key] = actual_id
				cur_id = actual_id + 1
			else
				output = (clause + " RETURN ID(user) AS id ").execute
				if(output.length > 0)
					cur_id = output[0]["id"] + 1
				else
					cur_id = max_id + 1
				end
			end
		end
	end


	def fix_user_linked_feed
		clause = User.match + User.return_group("ID(user) AS id")
		user_ids = clause.execute
		count = 0
		for user_id in user_ids
			user_id = user_id["id"]
			puts " SEARCHING FOR USER WITH ID #{user_id} #{count}".green
			begin
				clause = " MATCH (node1)-[feednext:FeedNext{user_id:" + user_id.to_s + "}]->() "\
						 " WITH node1, feednext "\
						 " ORDER BY toInt(node1.created_at) DESC "\
						 " DELETE feednext "\
						 " WITH collect(node1) as p "\
						 " FOREACH(i in RANGE(0, length(p)-2) |  "\
						 	"FOREACH(p1 in [p[i]] |  FOREACH(p2 in [p[i+1]] |  "\
						 		"CREATE UNIQUE (p1)-[:FeedNext{user_id:" + user_id.to_s + "}]->(p2)))) "\
						 " WITH LAST(p) AS last, HEAD(p) AS head "\
						 " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " "\
						 " MERGE (last)-[:FeedNext{user_id:" + user_id.to_s + "}]->(user) "\
						 " MERGE (user)-[:FeedNext{user_id:" + user_id.to_s + "}]->(head) "
				
				count = count + 1
				clause.execute
			rescue Exception => e
				clause = " MATCH (user:User) WHERE ID(user)=#{user_id} CREATE UNIQUE (user)-[:FeedNext{user_id:#{user_id}}]->(user) "
				count = count + 1
				clause.execute
			end
		end
	end

	def fix_user_notification_feed
		clause = User.match + User.return_group("ID(user) AS id")
		user_ids = clause.execute
		count = 0
		for user_id in user_ids
			user_id = user_id["id"]
			begin
				puts " SEARCHING FOR USER WITH ID #{user_id} #{count}".green
				clause = " MATCH (node1)-[next_notification:NextNotification{user_id:" + user_id.to_s + "}]->() "\
						 " WITH node1, next_notification "\
						 " ORDER BY toInt(node1.created_at) DESC "\
						 " DELETE next_notification "\
						 " WITH collect(node1) as p "\
						 " FOREACH(i in RANGE(0, length(p)-2) |  "\
						 	"FOREACH(p1 in [p[i]] |  FOREACH(p2 in [p[i+1]] |  "\
						 		"CREATE UNIQUE (p1)-[:NextNotification{user_id:" + user_id.to_s + "}]->(p2)))) "\
						 " WITH LAST(p) AS last, HEAD(p) AS head "\
						 " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " "\
						 " MERGE (last)-[:NextNotification{user_id:" + user_id.to_s + "}]->(user) "\
						 " MERGE (user)-[:NextNotification{user_id:" + user_id.to_s + "}]->(head) "
				count = count + 1
				clause.execute
			rescue Exception => e
				clause = " MATCH (user:User) WHERE ID(user)=#{user_id} CREATE UNIQUE (user)-[:NextNotification{user_id:#{user_id}}]->(user) "
				count = count + 1
				clause.execute
			end
		end
	end

	def self.reset_user_notification
		clause = " MATCH (:User)-[r:NextNotification]-() DELETE r "
		clause.execute

		clause = " MATCH ()-[r:NextNotification]->() DELETE r "
		clause.execute

		clause = " MATCH (:User)-[r:VisitedNotification]-() DELETE r "
		clause.execute

		clause = " MATCH ()-[r:VisitedNotification]->() DELETE r "
		clause.execute

		clause = " MATCH (user:User) "\
				" CREATE UNIQUE (user)-[:NextNotification{user_id:ID(user)}]->(user) "\
				" CREATE UNIQUE (user)-[:VisitedNotification{user_id:ID(user)}]->(user) "
		clause.execute
	end

end