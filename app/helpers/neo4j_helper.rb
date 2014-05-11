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
		@neo.execute_query("CREATE (y:Year{year:"+1000.to_s+"})<-[:Has_year]-(r:Root)")
		create_internal_nodes_for_an_year(1000)

		for year in 1001..2015
			t1 = Time.now
			prev_year = year-1
			node_year = @neo.execute_query("MATCH (r:Root), (pv:Year{year:"+prev_year.to_s+"})
				CREATE (pv)-[:Next_year]->(y:Year{year:"+year.to_s+"})<-[:Has_year]-(r)")
			create_internal_nodes_for_an_year(year)
			t2 = Time.now
			puts "#{year} #{t2-t1}"
		end

	end

	def create_internal_nodes_for_an_year(year)
		month_count = 1
		for month_count in 1..12 do
			month_node = @neo.execute_query("MATCH (y:Year{year:"+year.to_s+"})
				CREATE (y)-[:Has_month]->(m:Month{month:"+month_count.to_s+"})")
			days = Time.days_in_month(month_count, year)
			for day in 1..days do
				day_node = @neo.execute_query("MATCH (y:Year{year:"+year.to_s+"}), 
					(m:Month{month:"+month_count.to_s+"})
					CREATE (m)-[:Has_day]->(d:Day{day:"+day.to_s+"})")
			end
		end
	end

	def create_author(name, url)
		@neo ||= self.init
		author_node = @neo.execute_query("MERGE (a:Author{name:'"+name+"', gr_url:'"+url+"'})")
		author_node
	end

	def self.book_exists? book_url
		@neo ||= self.init
		@neo.execute_query("MATCH (b:Book{url:'"+book_url+"'}) RETURN b")["data"].present?
	end

	def self.get_book_node book_url
		@neo ||= self.init
		@neo.execute_query("MATCH (b:Book{url:'"+book_url+"'}) RETURN b")
	end

	def self.create_book book
		begin
			puts 1
			published_year = book.published_year
			book_url = book.url
			# book_exists = book_exists? book_url
			@neo ||= self.init
			puts 2
			if book.page_count.nil?
				page_count = 0
			else
				page_count = book.page_count 
			end

			@neo.execute_query("CREATE (b:Book{url:'"+book_url+"', 
				description:'"+book.description+"',
				title:'"+book.title+"',
				isbn:"+book.isbn+",
				page_count:"+page_count+",
				author_name:'"+book.author_name+"',
				published_year:"+published_year+",
				gr_rating:"+book.rating+",
				gr_author_url:'"+book.author_url+"',
				gr_reviews_count:"+book.reviews_count+",
				gr_ratings_count:"+book.ratings_count+"}")
			# node_book = @neo.create_node("url" => book_url,
			# 							"description" => book.description,
			# 							"title" => book.title,
			# 							"isbn" => book.isbn,
			# 							"page_count" => page_count,
			# 							"author_name" => book.author_name,
			# 							"published_year" => published_year,
			# 							"gr_rating" => book.rating,
			# 							"gr_author_url" => book.author_url,
			# 							"gr_reviews_count" => book.reviews_count,
			# 							"gr_ratings_count" => book.ratings_count)
			puts 3
			# @neo.add_label(node_book, "Book")
			puts 4
			author_node = create_author(book.author_name, book.author_url)
			puts 5
			@neo.create_relationship("Wrote", author_node, node_book)
			puts 6
			# unless book_exists
			# end
			if published_year.present?
				unless published_year.length < 4
					if published_year.length == 4
						puts 7
						invalid_year = published_year.to_i < 1000
						unless invalid_year
							year = published_year
						else
							book.update_column("published_year", nil)
						end
						puts 8
					else
						puts 9
						unless published_year.to_i < 0
							time = Time.parse published_year
							year = time.year
						end
						puts 10
					end
					self.bind_published_on(book.title, book.author_name, year) if year
					puts 11
				end
			end
			puts 12
		rescue Exception => e
			debugger			
		end

	end

	def self.bind_published_on(book_name, author_name, year)
		@neo ||= self.init
		if book_name.include? "\""
			@neo.execute_query("MATCH (b:Book{title:'"+book_name+"', author_name:'"+author_name+"'}),
			 (y:Year{year:"+year.to_s+"}) 
			CREATE (b)-[r:Published_on]->(y) RETURN r")
		else
			@neo.execute_query("MATCH (b:Book{title:\""+book_name+"\", author_name:\""+author_name+"\"}),
			 (y:Year{year:"+year.to_s+"}) 
			CREATE (b)-[r:Published_on]->(y) RETURN r")
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

	def self.init_goodreads_books
		count = 0
		t0 = Time.now
		for id in 1..1599004
			t1 = Time.now
			book = GoodReadsBook.find id
			if book && book.flag && book.neo_flag.nil?
				self.create_book book
				count = count + 1
				t2 = Time.now
				book.update_column("neo_flag", true)
				puts "#{t2-t1} #{count} #{book.title}"
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
end