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


	def self.detect_broken_feed user_id
		clause = "MATCH (user) WHERE ID(user) = " + user_id.to_s + " WITH user MATCH (user)-[r:FeedNext*1..]->(user) RETURN LENGTH(r) AS length, ID(user) AS id "
		response = clause.execute
		unless response.present? && response[0]["length"].present?
			GraphHelper.fix_feed user_id
		end
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
		starting_book_id = Constant::Id::BestBook.to_i
		match_clause = " MATCH (book) WHERE ID(book) = " + starting_book_id.to_s + " WITH book MATCH path = (book)-[:Next_book*]->(book) WHERE length(path) > 2 " 
		extract_clause = " WITH path, EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book WITH book WHERE NOT (book)-[:NextInCategory]-() "
		collect_categorised = Category::Root.match_books_root + " WITH DISTINCT root_category ,COLLECT(book) AS books "
		create_links = " FOREACH(i in RANGE(0, length(books)-2) |  FOREACH(p1 in [books[i]] |  FOREACH(p2 in [books[i+1]] |  MERGE (p1)-[:NextInCategory{from_category:root_category.uuid}]->(p2)))) WITH root_category, head(books) as most_popular, last(books) as least_popular MERGE (least_popular)-[:NextInCategory{from_category:root_category.uuid}]->(root_category) MERGE (root_category)-[:NextInCategory{from_category:root_category.uuid}]->(most_popular) RETURN least_popular, most_popular "		
		clause = match_clause + extract_clause + collect_categorised + create_links
		info = clause.execute[0]
	end

	def self.set_era_linked_list
		starting_book_id = Constant::Id::BestBook.to_i
		match_clause = " MATCH (book) WHERE ID(book) = " + starting_book_id.to_s + " WITH book MATCH path = (book)-[:Next_book*]->(book) WHERE LENGTH(path) > 2 " 
		extract_clause = " WITH path, EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book "
		collect_categorised = Era.match_books + " WITH DISTINCT era, COLLECT(book) AS books "
		create_links = " FOREACH(i in RANGE(0, length(books)-2) |  FOREACH(p1 in [books[i]] |  FOREACH(p2 in [books[i+1]] |  MERGE (p1)-[:NextInEra{from_category:ID(era)}]->(p2)))) WITH era, head(books) as most_popular, last(books) as least_popular MERGE (least_popular)-[:NextInEra{from_category:ID(era)}]->(era)-[:NextInEra{from_category:ID(era)}]->(most_popular) "		
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
			Blog.handle
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

end