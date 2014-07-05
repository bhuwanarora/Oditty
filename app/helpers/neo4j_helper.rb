module Neo4jHelper
	# require 'neography'
	# require 'neo4j-cypher'
	# require 'neo4j-cypher/neography'

	def self.init
		@neo = Neography::Rest.new
	end

	def self.query query
		Neo4j::Cypher.query{query}.to_s
	end

	def self.create_time_nodes
		self.init
		node = @neo.create_node("year" => 1000)
		@neo.add_label(node, "Year")
		create_internal_nodes_for_an_year(node, 1000)

		for year in 1001..2015
			t1 = Time.now
			prev_node = node
			node = @neo.create_node("year" => year)
			node_year = @neo.add_label(node, "Year")
			@neo.create_relationship("Next_year", prev_node, node)
			create_internal_nodes_for_an_year(node, year)
			t2 = Time.now
			puts "#{year} #{t2-t1}"
		end

	end

	def create_internal_nodes_for_an_year(node, year)
		for month_count in 1..12 do
			month_node = @neo.create_node("month" => month_count)
			@neo.create_relationship("Has_month", node, month_node)
			@neo.add_label(month_node, "Month")

			days = Time.days_in_month(month_count, year)
			puts "#{days}-#{month_count}-#{year}"
			for day in 1..days do
				day_node = @neo.create_node("day" => day)
				@neo.create_relationship("Has_day", month_node, day_node)
				@neo.add_label(day_node, "Day")
			end
		end
	end

	def create_author(name, url)
		@neo ||= self.init
		if(name.include? "'")
			author_node = @neo.execute_query('match (a:Author) where a.name = "'+name+'" return a')
		else
			author_node = @neo.execute_query("match (a:Author) where a.name = '"+name+"' return a")
		end
		author_present = author_node["data"].present?
		if author_present
			author_node = author_node["data"]
		else
			author_node = @neo.create_node("name" => name, "gr_url" => url)
			@neo.add_label(author_node, "Author")
		end

		author_node
	end

	def create_genre genre
		@neo ||= self.init
		name = genre.name
		if(name.include? "'")
			genre_node = @neo.execute_query('match (a:Genre) where a.name = "'+name+'" return a')
		else
			genre_node = @neo.execute_query("match (a:Genre) where a.name = '"+name+"' return a")
		end
		genre_present = genre_node["data"].present?
		if genre_present
			genre_node = genre_node["data"]
		else
			genre_node = @neo.create_node("name" => genre.name,
										"gr_url" => genre.url,
										"flag" => genre.flag,
										"gr_book_count" => genre.book_count)
			@neo.add_label(genre_node, "Genre")
		end

		genre_node
	end

	def self.book_exists? book_url
		@neo ||= self.init
		@neo.execute_query("MATCH (b:Book{url:'"+book_url+"'}) RETURN b")["data"].present?
	end

	def self.get_book_node book_url
		@neo ||= self.init
		@neo.execute_query("MATCH (b:Book{url:'"+book_url+"'}) RETURN b")
	end

	def self.resolve_int_bug
		@neo ||= self.init
		GoodReadsBook.where(:neo_flag => true).find_each do |book|
			ratings_count = book.ratings_count.gsub(/[^\d]/, '').to_i rescue 0
			reviews_count = book.reviews_count.gsub(/[^\d]/, '').to_i rescue 0
			page_count = book.page_count.gsub(/[^\d]/, '').to_i rescue 0
			title = book.title.gsub(/\(.*?\)/, '').strip.gsub("\"","'")
			clause = "MATCH (book:Book{title:\""+title+"\"}) RETURN book"
			puts "#{ratings_count} #{book.ratings_count} #{clause}"
			book_node = @neo.execute_query(clause)
			for node in book_node["data"]
				puts "--"
				@neo.set_node_properties(node, {
					"gr_ratings_count" => ratings_count,
					"gr_reviews_count" => reviews_count,
					"page_count" => page_count})
			end
		end
	end

	def self.create_book book
		begin
			unless book.published_year.present?
				published_year = ""
			else
				published_year = book.published_year
			end
			book_url = book.url
			# book_exists = book_exists? book_url
			@neo ||= self.init
			if book.page_count.nil?
				page_count = 0
			else
				page_count = book.page_count.gsub(/[^\d]/, '').to_i
			end

			if book.isbn.present?
				isbn = book.isbn
			else
				isbn = ""
			end
			if book.description.present?
				description = book.description
			else
				description = ""
			end

			reviews_count = book.reviews_count.gsub(/[^\d]/, '').to_i rescue 0
			ratings_count = book.ratings_count.gsub(/[^\d]/, '').to_i rescue 0

			author_name = book.author_name.gsub("\"", "'")
			title = book.title.gsub(/\(.*?\)/, '').strip.gsub("\"","'")
			node_book = @neo.create_node(
				"url" => book_url,
				"description" => description,
				"gr_title" => book.title,
				"title" =>  title,
				"isbn" => isbn,
				"page_count" => page_count,
				"author_name" => author_name,
				"published_year" => published_year,
				"gr_rating" => book.rating.to_f,
				"gr_author_url" => book.author_url,
				"gr_reviews_count" => reviews_count,
				"gr_ratings_count" => ratings_count)

			@neo.add_label(node_book, "Book")
			author_node = create_author(author_name, book.author_url)
			@neo.create_relationship("Wrote", author_node, node_book)
			if published_year.present?
				unless published_year.length < 4
					if published_year.length == 4
						invalid_year = published_year.gsub(/[^\d]/, '').to_i < 1000
						unless invalid_year
							year = published_year
						else
							book.update_column("published_year", nil)
						end
					else
						unless published_year.gsub(/[^\d]/, '').to_i < 0
							time = Time.parse published_year
							year = time.year
						end
					end
					self.bind_published_in(title, author_name, year) if year
				end
			end
			genres = GoodReadsBooksGenres.where(:good_reads_book_id => book.id)
			genres.each do |genre|
				genre_id = genre.good_reads_genre_id
				genre = GoodReadsGenre.find(genre_id)
				genre_node = create_genre genre
				@neo.create_relationship("Belongs_to", node_book, genre_node)
			end

			book.update_column("neo_flag", true)
			title
		rescue Neography::NeographyError => err
		  puts err.message     # Neo4j error message
		  # puts err.code        # HTTP error code
		  # puts err.stacktrace  # Neo4j Java stacktrace
		end
	end

	def self.bind_published_in(book_name, author_name, year)
		@neo ||= self.init
		if book_name.include? "\""
			@neo.execute_query('MATCH (b:Book{title:"'+book_name+'", author_name:"'+author_name+'"}),
			 (y:Year{year:"'+year.to_s+'"}) 
			CREATE (b)-[r:Published_in]->(y) RETURN r')
		else
			@neo.execute_query("MATCH (b:Book{title:\""+book_name+"\", author_name:\""+author_name+"\"}),
			 (y:Year{year:\""+year.to_s+"\"}) 
			CREATE (b)-[r:Published_in]->(y) RETURN r")
		end
	end

	def self.find_year_node year
		@neo ||= self.init
		year_node = @neo.execute_query("MATCH (y:Year{year:"+year.to_s+"}) RETURN y")
		year_node
	end

	def self.create_user
		@neo ||= self.init
		node_user = @neo.create_node("profile_views" => 0,
									"books_read_count" => 0,
									"followers_count" => 0,
									"name" => user.name,
									"birthday" => user.birthday,
									"images" => user.images_url,
									"gender" => user.gender,
									"latitude" => user.latitude,
									"longitude" => user.longitude,
									"reading_speed" => 0,
									"social_index" => 0,
									"book_worm_index" => 0)
		@neo.add_label(node_user, "User")

		year = Time.now.year
		month = Time.now.month
		day = Time.now.day
		self.find_day_node(year, month, day)
		@neo.create_relationship("joined_on", day_node, node_user)
	end

	def self.find_day_node(year, month, day)
		@neo ||= self.init
		match_query = "MATCH (y:Year{year:#{year}})-[:has_month]->(m:Month{month:#{month}})-[:has_day]->(d:Day{day:#{day}})"
		return_query = " RETURN d"
		query = match_query+return_query
		day_node = @neo.execute_query(query)
		day_node
	end

	def create_indexes
		@neo.create_schema_index("Book", ["title", "author_name"])
	end

	def self.init_goodreads_books_reverse
		# count = GoodReadsBook.where(:neo_flag => true).count
		t0 = Time.now
		for id in 1300000..1599029
			t1 = Time.now
			begin
				book = GoodReadsBook.find id
				if book && book.flag && book.neo_flag.nil? 
					unless book.title.include? "\\"
						title = self.create_book book
						# count = count + 1
						t2 = Time.now
						puts "#{t2-t1} #{id}/1599029 #{title}"
					end
				else
					puts id
				end
			rescue Exception => e
				puts e
			end
		end
	end

	def self.init_goodreads_books
		count = GoodReadsBook.where(:neo_flag => true).count
		t0 = Time.now
		for id in 1400000..1599029
			t1 = Time.now
			begin
				book = GoodReadsBook.find id
				if book && book.flag && book.neo_flag.nil? 
					unless book.title.include? "\\"
						title = self.create_book book
						count = count + 1
						t2 = Time.now
						puts "#{t2-t1} #{count}/1599029 #{title}"
					end
				else
					puts id
				end
			rescue Exception => e
				puts e
			end
		end
	end

	def self.init_shelfari_books
		begin
			ShelfariBook.where(:data_flag => true, :neo_flag => nil).find_each do |book|
				 # id     | name     | url   | description | summary |first_sentence 
				book_id = book.id
				book_title = nil
				
				AuthorsShelfariBooks.where(:shelfari_book_id => book_id).each do |author|
					book_title = @neo.execute_query("MATCH (author:Author{name:'"+author.name+"'})-[:Wrote]->(book:Book)
						RETURN book.title")
				end

				ShelfariBooksCategories.where(:shelfari_book_id => book_id).each do |shelfari_category|
					@neo.execute_query("MATCH (book:Book{title:'"+book_title+"'}), (category:Category{name:'"+shelfari_category.name+"'})
						CREATE (book)-[:Belongs_to]->(category)")
				end

				ShelfariBooksTags.where(:shelfari_book_id => book_id).each do |shelfari_tag|
					@neo.execute_query("MATCH (book:Book{title:'"+book_title+"'})
						MERGE (tag:Tag{name:'"+shelfari_tag.name+"'})
						CREATE (book)-[:Has{weight:"+shelfari_tag.weight+"}]->(tag)")
				end

				CharactersShelfariBooks.where(:shelfari_book_id => book_id).each do |character|
					@neo.execute_query("MATCH (book:Book{title:'"+book_title+"'})
						MERGE (character:Character{name:'"+character.name+"'})
						CREATE (book)-[:Has_character]->(character)")
					#other attributes for the character
				end

				ShelfariBooksThemes.where(:shelfari_book_id => book_id).each do |theme|
					@neo.execute_query("MATCH (book:Book{title:'"+book_title+"'})
						MERGE (theme:Theme{name:'"+theme.name+"'})
						CREATE (book)-[:Has_theme]->(theme)")
				end

				LocationsShelfariBooks.where(:shelfari_book_id => book_id).each do |location|
					@neo.execute_query("MATCH (book:Book{title:'"+book_title+"'})
						MERGE (location:Location{})")
				end

				MoviesShelfariBooks.where(:shelfari_book_id => book_id).each do |movie|
					@neo.execute_query("MATCH (book:Book{title:'"+book_title+"'})
						MERGE (movie:Movie{})
						CREATE (book)-[:Movie_based]->(movie)")
				end

				EbooksShelfariBooks.where(:shelfari_book_id => book_id).each do |ebook|
					@neo.execute_query("MATCH (book:Book{title:'"+book_title+"'})
						MERGE (ebook:Ebook{})
						CREATE (book)-[:Eversion]->(ebook)")
				end

				QuotesShelfariBooks.where(:shelfari_book_id => book_id).each do |quote|
					@neo.execute_query("MATCH (book:Book{title:'"+book_title+"'})
						MERGE (quote:Quote{})
						CREATE (book)-[:Has_quote]->(quote)")
				end

				NoteForParentsShelfariBook.where(:shelfari_book_id => book_id).each do |note_for_parent|
					@neo.execute_query("MATCH (book:Book{title:'"+book_title+"'})
						MERGE (note_for_parent:NoteForParent{})
						CREATE (book)-[:Has_note]->(note_for_parent)")
				end
			end
		rescue Exception => e
			
		end
	end

	def self.delete_book_nodes
		@neo ||= self.init
		book_nodes = @neo.execute_query("MATCH (b:BOOK) RETURN b")
		@neo.delete_node!(book_nodes[0])
	end

	def self.delete_author_nodes
		
	end

	def self.create_category_tree
		@neo ||= self.init
		root = ShelfariCategory.where(:name => 'ROOT').first
		root.children.each do |shelfari_category|
			puts shelfari_category.name
			@neo.execute_query("CREATE (c:Category{is_root:true, name:\""+shelfari_category.name+"\", s_url:\""+shelfari_category.url+"\"})")
			self.create_category_subtree_for(shelfari_category.url, shelfari_category.url, shelfari_category.id)
		end
	end

	def self.create_category_subtree_for(root_url, category_url, shelfari_category_id)
		begin
			ShelfariCategory.find(shelfari_category_id).children.each do |shelfari_category|
				puts "-"+shelfari_category.name
				@neo.execute_query("MATCH (r:Category{s_url:\""+root_url+"\"}), 
					(p:Category{s_url:\""+category_url+"\"})
				 CREATE (p)-[:Child]->(c:Category{is_root:false, name:\""+shelfari_category.name+"\", s_url:\""+shelfari_category.url+"\"})-[:Has_root]->(r)")
				if shelfari_category.children.present?
					self.create_category_subtree_for(root_url, shelfari_category.url, shelfari_category.id)
				end
			end
		rescue Neography::NeographyError => err
		  puts err.message     # Neo4j error message
		  puts err.code        # HTTP error code
		  puts err.stacktrace  # Neo4j Java stacktrace
		end
	end

	def self.create_time_groups
		@neo ||= self.init
		TimeGroup.all.each do |time_group|
			range = time_group.time_group.split("-")
			# time_group_node = @neo.create_node("name" => time_group.name,
												# "range" => time_group.time_group)
			# @neo.add_label(time_group_node, "Era")
			init_year = range[0].to_i
			end_year = range[1].to_i-1
			for year in init_year..end_year
				puts "TimeGroup #{time_group.name} #{time_group.time_group} #{year}"
				@neo.execute_query("MATCH (t:Era{name:'"+time_group.name+"'}),
									(y:Year{year:'"+year.to_s+"'})
									CREATE (y)-[:FromEra]->(t)")
			end
		end
	end

	def self.test
		@neo ||= self.init
		t1 = Time.now
		m = @neo.execute_query("MATCH (day:Day)<-[1..2]-(year:Year{year:1001 }) RETURN book")
		t2 = Time.now
		puts "#{t2-t1}"
		# Neography::Node.load(existing_node, @neo)
	end

	def self.init_database
		self.create_time_nodes
		puts "create_time_nodes_complete"
	 	self.init_goodreads_books
	 	puts "init_goodreads_books_complete"
	end

	def self.create_read_time_groups
		@neo ||= self.init
		node1 = @neo.create_node("name" => "For a flight journey", "page_count_range" => "<50")
		node2 = @neo.create_node("name" => "For a weekend getaway", "page_count_range" => "50-100")
		node3 = @neo.create_node("name" => "For a week holiday", "page_count_range" => "100-250")
		node4 = @neo.create_node("name" => "For a month vacation", "page_count_range" => ">250")
		@neo.add_label(node1, 'ReadTime')
		@neo.add_label(node2, 'ReadTime')
		@neo.add_label(node3, 'ReadTime')
		@neo.add_label(node4, 'ReadTime')
	end

	def self.label_readtime_groups
		@neo ||= self.init

		clause = "MATCH (book:Book)-[r:WithReadingTime]->(rt:ReadTime) DELETE r"
		@neo.execute_query(clause)
		puts "delete WithReadingTime relations".red

		clause = "MATCH (book:Book), (rt:ReadTime{page_count_range: '<50'}) WHERE book.page_count <= 50 CREATE (book)-[:WithReadingTime]->(rt)"
		puts clause.green
		@neo.execute_query(clause)

		clause = "MATCH (book:Book), (rt:ReadTime{page_count_range: '50-100'}) WHERE book.page_count > 50 AND book.page_count <= 100 CREATE (book)-[:WithReadingTime]->(rt)"
		puts clause.blue
		@neo.execute_query(clause)

		clause = "MATCH (book:Book), (rt:ReadTime{page_count_range: '100-250'}) WHERE book.page_count > 100 AND book.page_count <= 250 CREATE (book)-[:WithReadingTime]->(rt)"
		puts clause.yellow
		@neo.execute_query(clause)

		clause = "MATCH (book:Book), (rt:ReadTime{page_count_range: '>250'}) WHERE book.page_count > 250 CREATE (book)-[:WithReadingTime]->(rt)"
		puts clause.blue
		@neo.execute_query(clause)

		puts "DONE".red
	end

	def self.create_labels
		@neo ||= self.init

		labels = ["Books left in between", "I own this book", "Books I plan to Read", "Books I plan to buy"]
		for label in labels do
			puts label.green
			node = @neo.create_node("name" => label)
			@neo.add_label(node, "Label")
		end
	end


	def self.create_indexes
		@neo ||= self.init
		puts "indexing initiated..."
		@neo.create_schema_index("Book", ["title"])
		@neo.create_schema_index("Book", ["author_name"])
		@neo.create_schema_index("Author", ["name"])
		@neo.create_schema_index("Label", ["name"])
		@neo.create_schema_index("ReadTime", ["name"])
		@neo.create_schema_index("Era", ["name"])
		@neo.create_schema_index("Year", ["year"])
		@neo.create_schema_index("Genre", ["name"])
		@neo.set_node_auto_index_status(true)
		@neo.set_relationship_auto_index_status(true)
		puts "indexing finished..."
	end

	def self.add_constraints
		@neo ||= self.init
		clause = "CREATE CONSTRAINT ON (user:User) ASSERT user.email IS UNIQUE"
		@neo.execute_query clause
		puts clause.blue.on_red
	end
end