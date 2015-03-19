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
		for id in 1599029..1699029
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

	def self.add_book book
		# id     | name     | url   | description | summary |first_sentence 
		main_clause = ""
		t1 = Time.now
		book_id = book.id
		book_title = book.name.downcase.gsub(" ", "").gsub("\"", "").gsub("'", "").gsub(":", "")
		puts book_title+"-"+book_id.to_s.green
		author_name = ""
		
		AuthorsShelfariBooks.where(:shelfari_book_id => book_id).each do |author_book|
			author_id = author_book.author_id
			author = Author.find(author_id)
			human_profile = author.human_profile
			author_name = "@"+human_profile.name
			lower_case = author_name.downcase.gsub(" ", "").gsub("\"", "").gsub("'", "").gsub(":", "")
			overview = author.overview.gsub("\"", "'").to_s rescue ""

			clause = " MERGE (author:Author{search_index:\""+lower_case+"\"}) MERGE (book:Book{indexed_title:\""+book_title+"\", indexed_author_name:\""+lower_case+"\"}) ON CREATE SET book.title=\""+book.name.gsub("\"", "'")+"\" CREATE UNIQUE (author)-[:Wrote]->(book), (author)-[:AuthorFeed]->(author) SET author.indexed_name=\""+lower_case+"\", author.name=\""+author_name+"\", author.olid=\""+author.olid.to_s+"\", author.overview=\""+overview+"\", author.legal_name=\""+author.legal_name.to_s+"\", author.birthdate=\""+author.birthdate.to_s+"\", author.birthplace=\""+author.birthplace.to_s+"\", author.nationality=\""+author.nationality.to_s+"\", author.gender=\""+author.gender.to_s+"\", author.official_website=\""+author.official_website.to_s+"\", author.date_of_death=\""+author.date_of_death.to_s+"\", author.burial_location=\""+author.burial_location.to_s+"\", author.wiki_url=\""+author.wiki_url.to_s+"\", author.comments=\""+author.comments.to_s+"\" WITH book "
			main_clause = main_clause + clause
			puts "adding authors...".yellow
			# @neo.execute_query clause
		end

		# ShelfariBooksCategories.where(:shelfari_book_id => book_id).each do |book_category|
		# 	category_id = book_category.shelfari_category_id
		# 	category = ShelfariCategory.find(category_id)
		# 	category_name = category.name
		# 	lower_case = category_name.downcase.gsub(" ", "").gsub("\"", "").gsub("'", "").gsub(":", "")
			
		# 	clause =  " MERGE (category:Category{search_index:\""+lower_case+"\"}) CREATE UNIQUE (book)-[:FromCategory]->(category), (category)-[:CategoryFeed]->(category) SET category.indexed_category_name=\""+lower_case+"\", category.name=\""+category_name+"\", category.icon='"+category.icon.to_s+"' WITH book "
		# 	puts "adding categories...".yellow
		# 	# @neo.execute_query clause
		# 	main_clause = main_clause + clause
		# end

		ShelfariBooksTags.where(:shelfari_book_id => book_id).each do |book_tag|
			tag_id = book_tag.shelfari_tag_id
			weight = book_tag.weight
			shelfari_tag = ShelfariTag.find tag_id
			genre_name = shelfari_tag.name.gsub("\"", "'").to_s rescue ""
			lower_case = genre_name.downcase.gsub(" ", "").to_s rescue ""
			clause = " MERGE (genre:Genre{indexed_genre_name:\""+lower_case+"\"}) CREATE UNIQUE (book)<-[r:Belongs_to]-(genre) SET r.weight="+weight.to_s+" Set genre.name=\""+genre_name+"\" WITH book "
			puts "adding tags...".yellow
			# @neo.execute_query clause
			main_clause = main_clause + clause
		end

		# CharactersShelfariBooks.where(:shelfari_book_id => book_id).each do |character|
		# 	clause = "MATCH (book:Book{title:'"+book_title+"'})
		# 		MERGE (character:Character{name:'"+character.name+"'})
		# 		CREATE (book)-[:Has_character]->(character)"
		# 	@neo.execute_query clause
		# 	#other attributes for the character
		# end

		# ShelfariBooksThemes.where(:shelfari_book_id => book_id).each do |theme|
		# 	clause = "MATCH (book:Book{title:'"+book_title+"'})
		# 		MERGE (theme:Theme{name:'"+theme.name+"'})
		# 		CREATE (book)-[:Has_theme]->(theme)"
		# 	@neo.execute_query clause
		# end

		# LocationsShelfariBooks.where(:shelfari_book_id => book_id).each do |location|
		# 	clause = "MATCH (book:Book{title:'"+book_title+"'})
		# 		MERGE (location:Location{})"
		# 	@neo.execute_query clause
		# end

		MoviesShelfariBooks.where(:shelfari_book_id => book_id).each do |book_movie|
			movie_id = book_movie.movie_id
			movie = Movie.find movie_id
			movie_name = movie.name.downcase.gsub(" ", "").gsub("\"", "'").to_s rescue ""
			clause = " MERGE (movie:Movie{indexed_movie_name:\""+movie_name+"\"})  CREATE UNIQUE (book)-[:MovieBased]->(movie) SET movie.imdb_url=\""+movie.imdb_url.to_s+"\", movie.year=\""+movie.year.to_s+"\" WITH book "
			puts "adding movies...".yellow
			# @neo.execute_query clause
			main_clause = main_clause + clause
		end

		EbooksShelfariBooks.where(:shelfari_book_id => book_id).each do |book_ebook|
			ebook_id = book_ebook.ebook_id
			ebook = Ebook.find(ebook_id)
			notes = ebook.notes.gsub("\"", "'").to_s rescue ""
			clause = " MERGE (ebook:EBook{indexed_ebook_name:\""+ebook.name.gsub(" ","")+"\"})  CREATE UNIQUE (book)-[:Eversion]->(ebook) SET ebook.url=\""+ebook.url.to_s+"\", ebook.notes=\""+notes+"\" WITH book "
			puts "adding ebooks...".yellow
			# @neo.execute_query clause
			main_clause = main_clause + clause
		end

		# QuotesShelfariBooks.where(:shelfari_book_id => book_id).each do |quote|
		# 	clause = "MATCH (book:Book{title:'"+book_title+"'})
		# 		MERGE (quote:Quote{})
		# 		CREATE (book)-[:Has_quote]->(quote)"
		# 	@neo.execute_query clause
		# end

		NoteForParentsShelfariBooks.where(:shelfari_book_id => book_id).each do |book_reading_level|
			reading_level_id = book_reading_level.note_for_parent_id
			reading_level = NoteForParent.find reading_level_id

			clause = " MERGE (note_for_parent:ReadingLevel{type:\""+reading_level.name.to_s+"\"}) CREATE UNIQUE (book)-[:ReadingLevel]->(note_for_parent) WITH book "
			puts "adding note for parents...".yellow
			main_clause = main_clause + clause
		end
		main_clause = main_clause + " RETURN ID(book)"
		# puts main_clause.blue.on_red
		puts "executing...".red
		puts @neo.execute_query(main_clause)["data"][0].to_s.green

		book.update_column("flag", true)
		t2 = Time.now
		puts "#{t2-t1}".blue.on_red
	end

	def self.init_shelfari_books
		@neo ||= self.init
		ShelfariBook.where(:data_flag => true, :flag => true).find_each do |book|
			begin
				self.add_category_again book
			rescue Neography::SyntaxException
				book.update_column("flag", false)
				puts "Neography::SyntaxException".blue.on_red
			rescue Neography::UniquePathNotUniqueException
				book.update_column("flag", false)
				puts "Neography::UniquePathNotUniqueException".blue.on_red
			rescue Neography::NeographyError
				book.update_column("flag", false)
				puts "Neography::NeographyError".blue.on_red
			end
		end
	end

	def self.add_ebooks
		@neo ||= self.init
		EbooksShelfariBooks.all.find_each do |book_ebook|
			begin
				book_id = book_ebook.shelfari_book_id
				book = ShelfariBook.find book_id
				book_title = book.name.downcase.gsub(" ", "").gsub("\"", "").gsub("'", "").gsub(":", "")
				puts book_title.green

				ebook_id = book_ebook.ebook_id
				ebook = Ebook.find ebook_id
				ebook_name = ebook.name.downcase.gsub(" ", "").gsub("\"", "'").to_s rescue ""
				notes = ebook.notes.gsub("\"", "'").to_s rescue ""

				main_clause = "MATCH (book:Book{indexed_title:\""+book_title+"\"})"
				clause = " MERGE (ebook:Ebook{indexed_ebook_name:\""+ebook_name+"\"}) CREATE UNIQUE (book)-[:Eversion]->(ebook) SET ebook.url=\""+ebook.url.to_s+"\", ebook.notes=\""+notes+"\""
				puts "adding ebooks...".yellow
				main_clause = main_clause + clause
				@neo.execute_query main_clause
				book.update_column("ebook_flag", true)
			rescue Neography::SyntaxException
				book.update_column("ebook_flag", false)
				puts "Neography::SyntaxException".blue.on_red
			rescue Neography::UniquePathNotUniqueException
				book.update_column("ebook_flag", false)
				puts "Neography::UniquePathNotUniqueException".blue.on_red
			rescue Neography::NeographyError
				book.update_column("ebook_flag", false)
				puts "Neography::NeographyError".blue.on_red
			end
		end
	end

	def self.add_movies
		@neo ||= self.init
		MoviesShelfariBooks.all.find_each do |movie_book|
			begin
				book_id = movie_book.shelfari_book_id
				book = ShelfariBook.find book_id
				book_title = book.name.downcase.gsub(" ", "").gsub("\"", "").gsub("'", "").gsub(":", "")
				puts book_title.green

				movie_id = movie_book.movie_id
				movie = Movie.find movie_id
				movie_name = movie.name.downcase.gsub(" ", "").gsub("\"", "'").to_s rescue ""

				main_clause = "MATCH (book:Book{indexed_title:\""+book_title+"\"})"
				clause = " MERGE (movie:Movie{uuid:"+movie_id.to_s+"}) CREATE UNIQUE (book)-[:MovieBased]->(movie) SET movie.imdb_url=\""+movie.imdb_url.to_s+"\", movie.year=\""+movie.year.to_s+"\", movie.indexed_movie_name=\""+movie_name+"\", movie.name=\""+movie.name.gsub("\"", "'")+"\""
				puts "adding movies...".yellow
				main_clause = main_clause + clause
				@neo.execute_query main_clause
				book.update_column("movie_flag", true)
			rescue Neography::SyntaxException
				book.update_column("movie_flag", false)
				puts "Neography::SyntaxException".blue.on_red
			rescue Neography::UniquePathNotUniqueException
				book.update_column("movie_flag", false)
				puts "Neography::UniquePathNotUniqueException".blue.on_red
			rescue Neography::NeographyError
				book.update_column("movie_flag", false)
				puts "Neography::NeographyError".blue.on_red
			end
		end
	end

	def self.add_genres
		@neo ||= self.init
		ShelfariBooksTags.where(:genre_flag => nil).find_each do |book_tag|
			begin
				book_id = book_tag.shelfari_book_id
				book = ShelfariBook.find book_id
				book_title = book.name.downcase.gsub(" ", "").gsub("\"", "").gsub("'", "").gsub(":", "")
				weight = book_tag.weight

				shelfari_tag_id = book_tag.shelfari_tag_id
				puts "#{book_title.green} #{book_id} #{shelfari_tag_id} #{weight}"
				shelfari_tag = ShelfariTag.find shelfari_tag_id
				genre_name = shelfari_tag.name.gsub("\"", "'").to_s rescue ""
				lower_case = genre_name.downcase.gsub(" ", "").to_s rescue ""

				main_clause = "MATCH (book:Book{indexed_title:\""+book_title+"\"})"
				clause = " MERGE (shelfari_tag:Genre{indexed_genre_name:\""+lower_case+"\"}) CREATE UNIQUE (book)-[r:Belongs_to]->(shelfari_tag) SET r.weight="+weight.to_s+", shelfari_tag.name=\""+genre_name+"\""
				
				main_clause = main_clause + clause
				@neo.execute_query main_clause
				book_tag.update_column("genre_flag", true)
			rescue Neography::SyntaxException
				book_tag.update_column("genre_flag", false)
				puts "Neography::SyntaxException".blue.on_red
			rescue Neography::UniquePathNotUniqueException
				book_tag.update_column("genre_flag", false)
				puts "Neography::UniquePathNotUniqueException".blue.on_red
			rescue Neography::NeographyError
				book_tag.update_column("genre_flag", false)
				puts "Neography::NeographyError".blue.on_red
			end
		end
	end

	def self.add_categories
		@neo ||= self.init
		ShelfariBooksCategories.where(:category_flag => nil).find_each do |book_category|
			if (book_category.id != 543718) && (book_category.id != 544353)	
				begin
					book_id = book_category.shelfari_book_id
					book = ShelfariBook.find book_id
					book_title = book.name.downcase.gsub(" ", "").gsub("\"", "").gsub("'", "").gsub(":", "")

					shelfari_category_id = book_category.shelfari_category_id
					shelfari_category = ShelfariCategory.find shelfari_category_id
					category_name = shelfari_category.name.downcase.gsub(" ", "").gsub("\"", "'").to_s rescue ""
					puts "#{book_title.green} #{book_id} #{shelfari_category_id}"
					main_clause = "START book=node:node_auto_index('indexed_title:"+book_title+"*')"
					clause = " MERGE (shelfari_category:Category{uuid:"+shelfari_category_id.to_s+"}) CREATE UNIQUE (book)-[:FromCategory]->(shelfari_category)"
					main_clause = main_clause + clause
					@neo.execute_query main_clause
					book_category.update_column("category_flag", true)
				rescue Neography::SyntaxException
					book_category.update_column("category_flag", false)
					puts "Neography::SyntaxException".blue.on_red
				rescue Neography::UniquePathNotUniqueException
					book_category.update_column("category_flag", false)
					puts "Neography::UniquePathNotUniqueException".blue.on_red
				rescue Neography::NeographyError
					book_category.update_column("category_flag", false)
					puts "Neography::NeographyError".blue.on_red
				end
			end
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
			puts shelfari_category.name.blue
			lower_case = shelfari_category.name.downcase.gsub(" ", "").gsub("\"", "").gsub("'", "").gsub(":", "")
			clause = "MERGE (c:Category{uuid:"+shelfari_category.id.to_s+"}) SET c.is_root=true, c.name=\""+shelfari_category.name+"\", c.indexed_category_name=\""+lower_case+"\""
			@neo.execute_query(clause)
			self.create_category_subtree_for(shelfari_category.id, shelfari_category.id)
		end
	end

	def self.create_category_subtree_for(root, parent)
		ShelfariCategory.find(parent).children.each do |shelfari_category|
			puts "-"+shelfari_category.name.green
			lower_case = shelfari_category.name.downcase.gsub(" ", "").gsub("\"", "").gsub("'", "").gsub(":", "")
			clause = "MERGE (r:Category{uuid:"+root.to_s+"}) MERGE (p:Category{uuid:"+parent.to_s+"}) MERGE (c:Category{uuid:"+shelfari_category.id.to_s+"}) CREATE UNIQUE (p)-[:HasChild]->(c)-[:HasRoot]->(r) SET c.name=\""+shelfari_category.name+"\", c.indexed_category_name=\""+lower_case+"\""
			@neo.execute_query clause
			if shelfari_category.children.present?
				self.create_category_subtree_for(root, shelfari_category.id)
			end
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

		clause = "MATCH (book:Book), (rt:ReadTime{page_count_range: '<50'}) WHERE toInt(book.page_count) <= 50 CREATE UNIQUE (book)-[:WithReadingTime]->(rt)"
		puts clause.green
		@neo.execute_query(clause)

		clause = "MATCH (book:Book), (rt:ReadTime{page_count_range: '50-100'}) WHERE toInt(book.page_count) > 50 AND toInt(book.page_count) <= 100 CREATE UNIQUE (book)-[:WithReadingTime]->(rt)"
		puts clause.blue
		@neo.execute_query(clause)

		clause = "MATCH (book:Book), (rt:ReadTime{page_count_range: '100-250'}) WHERE toInt(book.page_count) > 100 AND toInt(book.page_count) <= 250 CREATE UNIQUE (book)-[:WithReadingTime]->(rt)"
		puts clause.yellow
		@neo.execute_query(clause)

		clause = "MATCH (book:Book), (rt:ReadTime{page_count_range: '>250'}) WHERE toInt(book.page_count) > 250 CREATE UNIQUE  (book)-[:WithReadingTime]->(rt)"
		puts clause.blue
		@neo.execute_query(clause)

		puts "DONE".red
	end

	def self.create_labels
		@neo ||= self.init

		labels = ["Books left in between", "I own this book", "Books I plan to Read", "Books I plan to buy"]
		for label in labels do
			puts label.green
			node = @neo.create_node("name" => label.upcase, "primary_label" => true)
			@neo.add_label(node, "Label")
		end
	end


	def self.create_indexes
		@neo ||= self.init
		puts "indexing initiated...".green
		@neo.execute_query "CREATE INDEX ON :Book(indexed_title)"
		@neo.execute_query "CREATE INDEX ON :Book(indexed_author_name)"
		@neo.execute_query "CREATE INDEX ON :Author(indexed_name)"
		@neo.execute_query "CREATE INDEX ON :Label(indexed_name)"
		@neo.execute_query "CREATE INDEX ON :ReadTime(indexed_name)"
		@neo.execute_query "CREATE INDEX ON :Era(indexed_name)"
		@neo.execute_query "CREATE INDEX ON :Genre(indexed_name)"
		@neo.execute_query "CREATE INDEX ON :User(indexed_name)"

		# @neo.create_schema_index("Book", ["indexed_title"])
		# @neo.create_schema_index("Book", ["indexed_author_name"])
		# @neo.create_schema_index("Author", ["indexed_name"])
		# @neo.create_schema_index("Label", ["indexed_name"])
		# @neo.create_schema_index("ReadTime", ["indexed_name"])
		# @neo.create_schema_index("Era", ["indexed_name"])
		# @neo.create_schema_index("Year", ["year"])
		# @neo.create_schema_index("Genre", ["indexed_name"])
		# @neo.create_schema_index("User", ["indexed_name"])
		@neo.set_node_auto_index_status(true)
		@neo.set_relationship_auto_index_status(true)
		puts "indexing finished...".green
	end

	def self.add_constraints
		@neo ||= self.init
		clause = "CREATE CONSTRAINT ON (user:User) ASSERT user.email IS UNIQUE"
		@neo.execute_query clause
		puts clause.blue.on_red
	end

	def self.create_new_indexes
		@neo ||= self.init
		skip = 10000
		start_id = 384293 #MIN ID
		end_id = 2500000 #MAX ID
		# limit = 100
		while start_id <= end_id
			puts "adding index_by title for book..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (book:Book) WHERE ID(book) >= "+start_id.to_s+" AND ID(book) < "+limit.to_s+"  SET book.indexed_author_name = REPLACE(book.indexed_author_name,' ', ''), book.indexed_title = REPLACE(book.indexed_title, ' ', ''), book.search_index = REPLACE(book.search_index, ' ', '')"
			@neo.execute_query clause
			start_id = start_id + skip
		end

		clause = "MATCH (author:Author) SET author.indexed_name = REPLACE(author.indexed_name, ' ', ''), author.search_index = REPLACE(author.indexed_name, ' ', '')"
		puts "adding index_by name for authors...".green
		@neo.execute_query clause

		puts "adding index_by name for labels...".green
		clause = "MATCH (label:Label) SET label.indexed_label_name = REPLACE(label.indexed_label_name, ' ', '')"
		@neo.execute_query clause

		puts "adding index_by name for labels...".green
		clause = "MATCH (readTime: ReadTime) SET readTime.indexed_readtime_name = REPLACE(readTime.indexed_readtime_name, ' ', '')"
		@neo.execute_query clause

		puts "adding index_by name for era...".green
		clause = "MATCH (era: Era) SET era.indexed_era_name = REPLACE(era.indexed_era_name, ' ', '')"
		@neo.execute_query clause

		puts "adding index_by name for genre...".green
		clause = "MATCH (genre: Genre) SET genre.indexed_genre_name = REPLACE(genre.indexed_genre_name, ' ', '')"
		@neo.execute_query clause

		puts "adding index_by name for users...".green
		clause = "MATCH (user: User) SET user.indexed_user_name = REPLACE(user.indexed_user_name, ' ', ''), user.search_index = REPLACE(user.search_index, ' ', '')"
		@neo.execute_query clause

	end

	def self.restructure_database
		# puts "Droping existing indexes...".green
		@neo ||= self.init
		# @neo.delete_schema_index("Book", "title")
		# @neo.delete_schema_index("Book", "author_name")
		# @neo.delete_schema_index("Author", "name")
		# @neo.delete_schema_index("Label", "name")
		# @neo.delete_schema_index("ReadTime","name")
		# @neo.delete_schema_index("Era", "name")
		# @neo.delete_schema_index("Genre", "name")
		
		clause = "MATCH (book:Book) WITH book, toFloat(book.gr_rating)*toFloat(book.gr_ratings_count)*toFloat(book.gr_reviews_count) as weight ORDER BY weight DESC, toFloat(book.gr_rating) WITH collect(book) as p FOREACH(i in RANGE(0, length(p)-2) |  FOREACH(p1 in [p[i]] |  FOREACH(p2 in [p[i+1]] |  CREATE UNIQUE (p1)-[:Next_book]->(p2))))"
		puts "adding books in form of sorted linked lists...".green
		@neo.execute_query clause

		# self.create_indexes
		skip = 10000
		start_id = 384293 #MIN ID
		end_id = 2500000 #MAX ID
		# limit = 100
		while start_id <= end_id
			puts "adding index_by title for book..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (book:Book)  WHERE ID(book) >= "+start_id.to_s+" AND ID(book) < "+limit.to_s+" CREATE UNIQUE (book)-[:BookFeed]->(book) SET book.indexed_author_name = LOWER(book.author_name), book.indexed_title = LOWER(book.title), book.search_index = LOWER(book.title), book.readers_count = 0, book.comment_count = 0, book.bookmark_count = 0, book.rating_count = 0, book.time_required = [0, 0, 0, 0]"
			@neo.execute_query clause
			start_id = start_id + skip
		end

		puts "adding index_by name for authors...".green
		clause = "MATCH (author:Author) SET author.indexed_name = LOWER(author.name), author.search_index = LOWER(author.name)"
		@neo.execute_query clause

		puts "adding index_by name for labels...".green
		clause = "MATCH (label:Label) SET label.indexed_label_name = LOWER(label.name), label.name = UPPER(label.name), label.basic = true"
		@neo.execute_query clause

		puts "adding index_by name for labels...".green
		clause = "MATCH (readTime: ReadTime) SET readTime.indexed_readtime_name = LOWER(readTime.name)"
		@neo.execute_query clause

		puts "adding index_by name for era...".green
		clause = "MATCH (era: Era) SET era.indexed_era_name = LOWER(era.name)"
		@neo.execute_query clause

		puts "adding index_by name for genre...".green
		clause = "MATCH (genre: Genre) SET genre.indexed_genre_name = LOWER(genre.name)"
		@neo.execute_query clause

		puts "adding index_by name for users...".green
		clause = "MATCH (user: User) SET user.indexed_user_name = LOWER(user.name), user.search_index = LOWER(user.name)"
		@neo.execute_query clause

		puts "End...".red
	end

	def self.add_labels_to_existing_user
		@neo ||= self.init
		clause = "MATCH (user:User), (label:Label{basic:true}) CREATE UNIQUE (user)-[:BookmarkAction{user_id:ID(user)}]->(label)"
	end

	def self.remove_colon_from_indexed_fields
		@neo ||= self.init
		skip = 10000
		start_id = 384293 #MIN ID
		end_id = 2500000 #MAX ID
		# limit = 100
		while start_id <= end_id
			puts "adding index_by title for book..."+start_id.to_s.green
			limit = start_id + skip
			clause = 'MATCH (book:Book) WHERE ID(book) >= '+start_id.to_s+' AND ID(book) < '+limit.to_s+'  SET book.indexed_author_name = REPLACE(book.indexed_author_name,"]", ""), book.indexed_title = REPLACE(book.indexed_title, "]", ""), book.search_index = REPLACE(book.search_index, "]", "")'
			@neo.execute_query clause
			start_id = start_id + skip
		end

		clause = 'MATCH (author:Author) SET author.indexed_name = REPLACE(author.indexed_name, "]", ""), author.search_index = REPLACE(author.indexed_name, "]", "")'
		puts "adding index_by name for authors...".green
		@neo.execute_query clause

		puts "adding index_by name for labels...".green
		clause = 'MATCH (label:Label) SET label.indexed_label_name = REPLACE(label.indexed_label_name, "]", "")'
		@neo.execute_query clause

		puts "adding index_by name for labels...".green
		clause = 'MATCH (readTime: ReadTime) SET readTime.indexed_readtime_name = REPLACE(readTime.indexed_readtime_name, "]", "")'
		@neo.execute_query clause

		puts "adding index_by name for era...".green
		clause = 'MATCH (era: Era) SET era.indexed_era_name = REPLACE(era.indexed_era_name, "]", "")'
		@neo.execute_query clause

		puts "adding index_by name for genre...".green
		clause = 'MATCH (genre: Genre) SET genre.indexed_genre_name = REPLACE(genre.indexed_genre_name, "]", "")'
		@neo.execute_query clause

		puts "adding index_by name for users...".green
		clause = 'MATCH (user: User) SET user.indexed_user_name = REPLACE(user.indexed_user_name, "]", ""), user.search_index = REPLACE(user.search_index, "]", "")'
		@neo.execute_query clause
	end

	def self.grids
		grid_array = ["Books becoming movies", "Greatest Batman Graphic novels", "Must Reads for Dog Lovers", "Books To Read When Life Sucks", "Books that will change your view of the world", "Big Idea Business Books", "Books every entrepreneur must read before starting up", "Motivational Books of all time", "Childhood Classics you should reread as adults", "Books that will inspite creativity"]
		@neo ||= self.init
		for grid in grid_array
			puts grid.green
			clause = "CREATE (grid:BookGrid{name:\""+grid+"\", indexed_grid_name:\"" + 
				grid.downcase.gsub(" ", "").gsub("'", "")+"\"})"	
			@neo.execute_query clause		
		end
	end

	def self.index_authors
		# min_id = 384295
		# max_id = 2567037
		# clause = 'MATCH (a:Author) SET a.indexed_main_author_name = REPLACE(a.name, " ", "")'
		# @neo ||= self.init
		# puts "spaces removal..."
		# @neo.execute_query clause

		# clause = 'MATCH (a:Author) SET a.indexed_main_author_name = REPLACE(a.indexed_main_author_name, "\'", "")'
		# @neo ||= self.init
		# puts "inverted commas removal"
		# @neo.execute_query clause

		clause = 'MATCH (a:Author) SET a.indexed_main_author_name = LOWER(a.indexed_main_author_name)'
		@neo ||= self.init
		puts "downcase..."
		@neo.execute_query clause
	end

	def self.sorted_readtime_books
		@neo ||= self.init
		clause = "MATCH ()-[r:NextLongRead]->() DELETE r"
		puts "deleting...".green
		@neo.execute_query clause

		# clause = "MATCH (book:Book) WHERE toInt(book.page_count) <> 0 AND toInt(book.page_count) <= 50 WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) * toFloat(book.gr_rating) AS total_weight, toFloat(book.gr_ratings_count) * toFloat(book.gr_rating) AS rating_weight ORDER BY total_weight DESC, rating_weight DESC WITH collect(book) as p FOREACH(i in RANGE(0, length(p)-2) |  FOREACH(p1 in [p[i]] |  FOREACH(p2 in [p[i+1]] |  CREATE UNIQUE (p1)-[:NextTinyRead]->(p2))))"
		# puts "adding tiny reads in form of sorted linked lists...".green
		# @neo.execute_query clause

		# clause = "MATCH (book:Book) WHERE book.page_count <> 0 AND toInt(book.page_count) > 50 AND toInt(book.page_count) < 100 WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) * toFloat(book.gr_rating) AS total_weight, toFloat(book.gr_ratings_count) * toFloat(book.gr_rating) AS rating_weight ORDER BY total_weight DESC, rating_weight DESC WITH collect(book) as p FOREACH(i in RANGE(0, length(p)-2) |  FOREACH(p1 in [p[i]] |  FOREACH(p2 in [p[i+1]] |  CREATE UNIQUE (p1)-[:NextSmallRead]->(p2))))"
		# puts "adding Small reads in form of sorted linked lists...".green
		# @neo.execute_query clause

		
		# clause = "MATCH (book:Book) WHERE book.page_count <> 0 AND toInt(book.page_count) > 100 AND toInt(book.page_count) < 250 WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) * toFloat(book.gr_rating) AS total_weight, toFloat(book.gr_ratings_count) * toFloat(book.gr_rating) AS rating_weight ORDER BY total_weight DESC, rating_weight DESC WITH collect(book) as p FOREACH(i in RANGE(0, length(p)-2) |  FOREACH(p1 in [p[i]] |  FOREACH(p2 in [p[i+1]] |  CREATE UNIQUE (p1)-[:NextNormalRead]->(p2))))"
		# puts "adding normal reads in form of sorted linked lists...".green
		# @neo.execute_query clause

		clause = "MATCH (book:Book) WHERE book.page_count <> 0 AND toInt(book.page_count) > 250 WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) * toFloat(book.gr_rating) AS total_weight, toFloat(book.gr_ratings_count) * toFloat(book.gr_rating) AS rating_weight ORDER BY total_weight DESC, rating_weight DESC WITH collect(book) as p FOREACH(i in RANGE(0, length(p)-2) |  FOREACH(p1 in [p[i]] |  FOREACH(p2 in [p[i+1]] |  CREATE UNIQUE (p1)-[:NextLongRead]->(p2))))"
		puts "adding long reads in form of sorted linked lists...".green
		@neo.execute_query clause

		clause = "MATCH ()-[r1:WithReadingTime]->(:ReadTime) DELETE r1"
		puts "Delete WithReadingTime relations...".green
		@neo.execute_query clause	
	end

	def self.delete_belongs_to_relationship_on_categories
		@neo ||= self.init
		clause = "MATCH (c:Category)-[r:Belongs_to]-(b) CREATE UNIQUE (c)<-[:FromCategory]-(b) DELETE r"
		@neo.execute_query clause	
	end

	def self.get_best_reads_for_time
		@neo ||= self.init
		clause = "MATCH (book)-[r:NextTinyRead]->(:Book) WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) * toFloat(book.gr_rating) AS total_weight ORDER BY total_weight DESC RETURN ID(book) LIMIT 1"
		puts @neo.execute_query(clause).to_s.green

		clause = "MATCH (book)-[r:NextSmallRead]->(:Book) WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) * toFloat(book.gr_rating) AS total_weight ORDER BY total_weight DESC RETURN ID(book) LIMIT 1"
		puts @neo.execute_query(clause).to_s.green

		clause = "MATCH (book)-[r:NextNormalRead]->(:Book) WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) * toFloat(book.gr_rating) AS total_weight ORDER BY total_weight DESC RETURN ID(book) LIMIT 1"
		puts @neo.execute_query(clause).to_s.green

		clause = "MATCH (book)-[r:NextLongRead]->(:Book) WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) * toFloat(book.gr_rating) AS total_weight ORDER BY total_weight DESC RETURN ID(book) LIMIT 1"
		puts @neo.execute_query(clause).to_s.green
	end

	def self.remove_tiny_reads_with_zero_count
		@neo ||= self.init
		clause = "MATCH (b1:Book)-[r1:NextTinyRead]-(b:Book)-[r2:NextTinyRead]->(b2:Book) WHERE toInt(b.page_count) = 0 CREATE (b1)-[:NextTinyRead]->(b2) DELETE r1, r2"
		puts clause.green
		@neo.execute_query clause
	end

	def self.set_year_labels
		@neo ||= self.init
		# MATCH (book:Modernism) RETURN COUNT(book)
		clause = "MATCH (book)-[:Published_in]->(y:Year) WHERE toInt(y.year) >= 658 AND toInt(y.year) < 1100 SET book :OldEnglishLiterature"
		puts "OldEnglishLiterature".green
		@neo.execute_query clause

		clause = "MATCH (book)-[:Published_in]->(y:Year) WHERE toInt(y.year) >= 1100 AND toInt(y.year) < 1500 SET book :MiddleEnglishLiterature"
		puts "MiddleEnglishLiterature".green
		@neo.execute_query clause

		clause = "MATCH (book)-[:Published_in]->(y:Year) WHERE toInt(y.year) >= 1500 AND toInt(y.year) < 1660 SET book :EnglishRenaissance"
		puts "EnglishRenaissance".green
		@neo.execute_query clause

		clause = "MATCH (book)-[:Published_in]->(y:Year) WHERE toInt(y.year) >= 1660 AND toInt(y.year) < 1798 SET book :NeoClassicalPeriod"
		puts "NeoClassicalPeriod".green
		@neo.execute_query clause

		clause = "MATCH (book)-[:Published_in]->(y:Year) WHERE toInt(y.year) >= 1798 AND toInt(y.year) < 1837 SET book :Romanticism"
		puts "Romanticism".green
		@neo.execute_query clause

		clause = "MATCH (book)-[:Published_in]->(y:Year) WHERE toInt(y.year) >= 1837 AND toInt(y.year) < 1901 SET book :VictorianLiterature"
		puts "VictorianLiterature".green
		@neo.execute_query clause

		clause = "MATCH (book)-[:Published_in]->(y:Year) WHERE toInt(y.year) >= 1900 AND toInt(y.year) < 1939 SET book :Modernism"
		puts "Modernism".green
		@neo.execute_query clause

		clause = "MATCH (book)-[:Published_in]->(y:Year) WHERE toInt(y.year) >= 1939 AND toInt(y.year) < 2000 SET book :PostModernLiterature"
		puts "PostModernLiterature".green
		@neo.execute_query clause

		clause = "MATCH (book)-[:Published_in]->(y:Year) WHERE toInt(y.year) >= 2000 AND toInt(y.year) < 2015 SET book :TwentiethCenturyLiterature"
		puts "TwentiethCenturyLiterature".green
		@neo.execute_query clause
	end

	def self.set_icons
		@neo ||= self.init
		ShelfariCategory.where(:name => 'ROOT').first.children.each do |category|
			clause = "MATCH (c:Category{uuid:"+category.id.to_s+"}) SET c.icon=\""+category.icon+"\""
			puts category.name.green
			@neo.execute_query clause
		end
	end


	def self.set_star_genres
		@neo ||= self.init
		clause = "MATCH (genre:Genre)<-[r:Belongs_to]-(b:Book) WHERE toINT(genre.gr_book_count) > 1000 WITH DISTINCT(genre) as genre SET genre :StarGenre, genre.indexed_star_genre_name = genre.indexed_genre_name"
		puts clause.blue.on_red
		@neo.execute_query clause
	end

	def self.set_active_books
		@neo ||= self.init
		skip = 10000
		start_id = 384294 #MIN ID
		end_id = 2545302 #MAX ID
		# limit = 100
		while start_id <= end_id
			puts "set_active_books..."+start_id.to_s.green
			limit = start_id + skip
			clause = 'MATCH (book:Book) WHERE ID(book) >= '+start_id.to_s+' AND ID(book) < '+limit.to_s+' AND book.description <> "" AND book.description IS NOT NULL SET book :ActiveBook RETURN COUNT(book)'
			puts @neo.execute_query(clause)["data"][0]
			start_id = start_id + skip
		end	
	end

	def self.set_total_weight
		@neo ||= self.init
		skip = 10000
		start_id = 384293 #MIN ID
		end_id = 2655796 #MAX ID
		# limit = 100
		while start_id <= end_id
			puts "set_total_weight..."+start_id.to_s.green
			limit = start_id + skip
			clause = 'MATCH (book:Book) WHERE ID(book) >= '+start_id.to_s+' AND ID(book) < '+limit.to_s+'  SET book.total_weight = toFloat(book.gr_rating) * toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count)'
			puts @neo.execute_query(clause)["data"][0]
			start_id = start_id + skip
		end
	end

	def self.remove_less
		@neo ||= self.init
		skip = 10000
		start_id = 384293 #MIN ID384296
		end_id = 2655796 #MAX ID2545256
		# limit = 100
		while start_id <= end_id
			puts "set_total_weight..."+start_id.to_s.green
			limit = start_id + skip
			clause = 'MATCH (book:Book) WHERE ID(book) >= '+start_id.to_s+' AND ID(book) < '+limit.to_s+'  SET book.description = REPLACE(book.description, "(less)", "")'
			puts @neo.execute_query(clause)["data"][0]
			start_id = start_id + skip
		end	
	end

	def self.remove_attherate
		@neo ||= self.init
		skip = 10000
		start_id = 384295 #MIN ID
		end_id = 2655788 #MAX ID
		while start_id <= end_id
			puts "remove_attherate..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (a:Author) WHERE ID(a) >= "+start_id.to_s+" AND ID(a) < "+limit.to_s+" SET a.indexed_main_author_name=REPLACE(a.indexed_main_author_name, '@', ''), a.search_index = a.indexed_main_author_name"
			@neo.execute_query clause
			start_id = start_id + skip
		end
	end

	def self.set_author_rating
		@neo ||= self.init
		skip = 10000
		start_id = 384295 #MIN ID
		end_id = 2655788 #MAX ID
		while start_id <= end_id
			puts "set_author_rating..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (a:Author)-[:Wrote]->(b:Book) WHERE ID(a) >= "+start_id.to_s+" AND ID(a) < "+limit.to_s+" FOREACH(x in a | SET x.rating = AVG(toFloat(b.gr_rating)))"
			@neo.execute_query clause
			start_id = start_id + skip
		end
	end


	# def self.delete_labels
	# 	@neo ||= self.init
	# 	labels = ["Folkways, Columbia, CBS, Vanguard, Sony Kids’, SME", "Tuff Gong, Ghetto Youths", "Jive/RCA Records, Columbia/SME Records, Interscope/Universal Records", "Vertigo, Mercury", "Ariola, RCA", "Leathür, Elektra, MCA", "Eleven Seven, Elektra, Mötley, Sanctuary, Leathür, Warner Music Group, Beyond", "Colpix, Philles, Columbia, Apple", "Verve, Bizarre, Straight, DiscReet, Zappa, Barking Pumpkin", "Rational, Enigma, Alias, 125 Records", "Phonogram Records, Track-BCR Records", "Sony BMG (1990–97), Island (2002–03), Sedna (2004–present), MCA/Polydor (2005–present), Mercury Records, (2012–present)", "Arista, Columbia", "Mute", "Om Records", "Epic, Reprise, PVK, Creole", "Warner Music Japan", "Reprise, Warner Bros., Eyeball", "Zoo, Mercury, Island, Def American, Echo, Head Heritage", "Nothing, Hell, etc., Cooking Vinyl", "Interscope, Live Nation, Maverick, Sire, Warner Bros.", "Epitaph, Atlantic, ANTI-", "ArtistShare, Telarc, A&M", "Columbia, Asylum", "Epic, CBS, Jet", "Sun, Columbia, Mercury, American, House of Cash, Legacy Recordings", "A&M, Deutsche Grammophon, Universal Music Group", "Columbia, Sony Music Latin, Sony Music Mexico", "UZI Suicide, Geffen, RCA, Maverick, Sub Pop, Century Media, Armoury", "Chrysalis Records, CMC International, Bel Chiasso Records", "Track, Polydor, Atlantic, Atco, Decca, Rykodisc, Warner Bros.", "I.R.S. (1985-1986), MCA (1987–1991), Virgin (1987–1999), Chrysalis (1996), Ark 21 (1996-1997), Rykodisc (2007)", "Loud, Combat, Capitol, Sanctuary, Roadrunner, Tradecraft", "Decca, Deram, London, NEMS, Columbia, Island, RCA, Instinct, Sanctuary, Anti, Naïve", "Zero, Decca/MCA, Columbia, Audium, Interscope", "Parlophone, Swan, Vee-Jay, Capitol, United Artists, Apple", "Geffen, UZI Suicide, Shrapnel", "Capitol, Geffen, MCA, Cabo Wabo Music, Beyond Music, Loud & Proud, Roadrunner, Silverline Records, earMUSIC", "Sub Pop, DGC, Geffen", "Sparmac, RCA, Gomer", "Island, Teen Island, RBMG, School Boy", "Rock 'n Roll Records, Capitol, Placebo, TK, Scotti Brothers, Volcano, RCA", "Lakota Records", "Centricity Music", "Columbia, Next Plateau Entertainment", "Hollywood, RCA", "DSP Media (South Korea), Universal Sigma (Japan), Warner Music (Taiwan, Hong Kong)", "A&M, Interscope, Cherry Red, Metropolis London Music Limited", "The End, Uppity Cracker", "Decca, www.nashartistmanagement.com", "Folkways, Riverside, Tradition, Monument, Elektra", "Bar/None", "Red Hill, Island Def Jam, Columbia, Capitol", "Independent", "Barnaby, Dunhill, MCA, Margaritaville Records, Island, PolyGram, Mailboat, RCA", "Shadow Mountain", "Signature Sounds, V2, Sony BMG/Victor", "Island, Super", "Fueled By Ramen, MCA Records, Skunk Records, DreamWorks Records, Long Beach Records, AFO Records", "Columbia, RMM, Sony Music Latin", "A&M, Elektra", "Reunion, Sensibility Music", "Uni. MCA Nashville, New West, E² Records, Warner Bros.", "Various", "Arista Records, Warner Bros. Records", "Epic (1999–2003), So So Def (2003–2007)", "J, A&M/Octone, Interscope", "Atlantic, Emblem Music", "Sparrow, Troubadour for the Lord", "Columbia", "Dreamworks Records Brotherly Recordings", "Specialty Records, Savoy Records, Vee-Jay Records, Columbia Records, Nashboro Records", "Warner Bros. Records, EMI", "Blue Note, CTI, Embryo, Prestige, Milestone, Sunnyside", "RCA (1983–1992), MCA (1992–1997), Mercury (1997–2003), Asylum/Curb (2003-2009), Curb (2009–present)", "Island", "Elektra, SME Records, Tigress", "Virgin, Virgin EMI, Capitol Music, Universal Music Group", "New West", "Integrity, Word, Sony Wonder, Star Song, Sparrow, A&M, Chapel Lane, Women of Faith", "Paul Smith", "Luaka Bop, Nonesuch, Thrill Jockey, Sire, Warner Bros.", "Def Jam, Roc-A-Fella, Roc Nation", "SeaFire Productions, Inc", "Wind-up, Universal Republic, Roadrunner, EMI", "2.13.61, SST", "Indolent", "Wavecrest Music", "Mute Records", "Myrrh, Street Level, HighTone", "Columbia, ABC", "E-C Mix Records, EMI", "BLP (US), Liaison (US), Blix Street (US), Hot (Europe)", "Caw Records, Eastwest Records", "Sire, Warner Bros., Red Star, Matador, Rhino", "Jive, Concept Records, Sony, Steps Recordings, Warner Music", "Warner Bros. Records, Hog County Production, 31 Tigers", "RCA Records Nashville", "Chelsea", "A&M, Sony", "Relapse Records, Escape Artist Records, Happy Couples Never Last, Melting Wing, What Else? Records", "Three Crows Records", "Warner Bros., Maverick, Reprise, Altered Beats", "Beserkley, CleanCuts", "Hear The Music Productions, Signpost Music", "Blue Fog, Flemish Eye, No Quarter", "XL", "Castle Face Records, In The Red Records, Load Records, Narnack Records", "Columbia, MVS (France), Caroline Records, Sony Music, Warner Music Group, Get Hip Records, Bomp! Records, Alive Records", "Rude Girl Records, Columbia Records, Verve Records, Windham Hill Records", "Mercury Nashville, Dirt Road", "Survivor Records", "Bella Union Partisan USA, Sena Iceland", "Kelmac Records, Zodiac, MCA, ABC", "London, Regal, Capitol, Warner Bros.", "Warner Bros.", "Capitol, PolyGram, Shout! Factory", "MGM, RCA Victor, United Artists, Blue Note, Qwest/Warner Bros. Records", "Columbia / Sony BMG, Hundred Handed/Everything Evil", "ATO Records", "C2, Work, Q, City Light, Atlantic", "Vertigo, Mercury, Melodramatic Records", "Virgin, EMI, Capitol, Innocent, Sony Music Australia", "Angel Guardian Records, (2008 – present)", "Tuff Gong, Ghetto Youths, Universal Republic", "A&M, Universal", "Liberty, RCA, Atlantic, Columbia, Island, Justice Records, Lost Highway Legacy Recordings", "Drag City, Domino", "Atlantic, Valory", "Columbia Records, Daywind Records", "Isaac Mizrahi New York, Isaac Mizrahi, Isaac Mizrahi Jeans, Isaac Mizrahi Fabulous, IsaacMizrahiLIVE!", "Roadrunner, Great Big Mouth", "Burning Field Music, Waterbug Records, Razor & Tie", "Traitor, Trisol Music Group, The End, The Asylum Emporium", "Hollywood", "ZE", "Warner Bros., Image, Mötley, Hip-O, Elektra, Beyond, Leathür", "J.V.B. (1956-1961), Columbia (1961-1967), Atlantic (1968-1979), Arista (1980-2004), RCA (2011-present)", "ForeFront Records, EMI CMG", "Epic Records, Immortal Records, Sony Records", "Zomba, GospoCentric, Sparrow, Interscope, J", "Warner, Capitol", "Warner Bros., Interscope, Magna Carta, CMH", "Epic Records, Infinity Records, MCA Records, Elektra Records", "Falling Mountain Music", "Epic, Philadelphia Int'l, MCA, Def Soul Classics, Umbrella, Bungalo, Resolution (2013 - )", "Warner Bros., Redline Entertainment", "Asylum, Island, ANTI-", "Capitol, Mobile Fidelity, MCA, Breeze Hill, Levon", "MCA", "Fuck City, Island", "Elektra Records, Geffen/MCA Records, Mesa Bluemoon/Rhino/Atlantic Records, Wildflower Records", "Warner Bros., Nonesuch/Elektra", "Elektra", "2 Tone, Stiff, Virgin, V2, Go Discs!, Lucky 7 Records", "Caroline, Virgin, Reprise, Warner Bros.", "4AD Records, Throwing Music, Sire/Reprise/Warner Bros. Records", "Asylum, Atlantic, Epic, RCA Victor, Shanachie", "Capitol Records", "Creation, Granary Music, Full Frequency, New Alliance, Reflex, Restless, Rhino, Rough Trade, Rykodisc, SOL, SST, Virgin, Warner Bros., Yep Roc", "Republic Records", "Capitol Nashville", "Fat Hippy Records (2013-present), Geffen (2004-2007) A&M (2003-2004) Fat Hippy Records (2003)", "Capitol/EMI, Sire/Reprise/Warner Bros., Brother/Reprise/Warner Bros., Giant/Warner Bros., Caribou/CBS,, Nonesuch/Elektra, Walt Disney", "Rockingale, Ode/Epic/CBS Records, Priority/EMI Records", "sixsteps/Sparrow", "Capitol, PMR", "Bethlehem, Colpix, Philips, RCA Victor, CTI, Legacy Recordings", "Death Row, Interscope, No Limit, Priority, Star Trak, Geffen, Doggystyle, Maker Studios, Vice Records, Mad, Decent, RCA", "Polydor, EMI, Chrysalis", "Virgin, I.R.S, RageOn, Bulge, Gadly, Wabuho, Bulge", "Capitol, Asylum, Verve", "RCA, J, Arista, Rowdy", "Federal, King, Dade, Try Me, Smash, People, Polydor, Scotti Bros.", "RCA (BMG),, Anxious Records,, Surfdog Records,, The Artist Network,, Weapons of Mass Entertainment, Kobalt[1]", "Island, Polydor, EG, Obscure, Opal, Virgin, Astralwerks, All Saints Records, Rykodisc, Warner Bros.", "Deram, RCA, Virgin, EMI, ISO, Columbia, BMG, Pye, Vocalion", "B.F. Deal, Featherbed, Philo, MCA, Elektra, Rounder, New Door", "Sony BMG/Columbia, Cadence", "Raw Energy, Asian Man, Rebel Alliance", "Decca, Rolling Stones, Virgin/EMI, Mindless", "Pop, Aural, Postcard, Creeping Bent", "Recall (2001–2005), President (2006–present)", "Warwick, Miracle, Gordy, Motown, Atlantic, New Door", "Atlantic, Victor Entertainment, SPV GmbH, Velvel", "Xing Entertainment (South Korea) (2006-2007), NH Media (South Korea) (2008-present), Avex Trax (Japan), (2011-present)", "Survivor, sixsteps", "Indie", "Sony BMG/Beach Street/Reunion", "Hillsong, INO, Integrity", "Warner Bros., Reprise, Walt Disney (Disney·Pixar films), DreamWorks/Interscope/Universal, Nonesuch/Elektra", "Integrity Music", "Verve, Reprise, 143, Atlantic", "Uzi Suicide", "Screen Gems, EMI", "Atlantic", "Inertia, Grizzly UK", "Universal Republic, Tooth & Nail, Wood Water", "A&M, Chime Entertainment", "Badman Recording Co., Elephant Lady Records, Stay U", "Iris Records", "Imprint Records, Curb Records", "Virgin, EMI Records", "RCA", "RCA (2008-12), 19 (2008-), XIX Recordings (2013-present)", "Mercury, Show Dog-Universal Music", "Geffen, MCA, DC Flag, Suretone", "RCA, Universal Music Group", "Righteous Babe", "Milk & Honey, Sparrow, Myrrh", "Private Stock, RCA", "Domino", "Sun Records, Judd Records, Vee-Jay Records, Tollie Records, Smash Records, Various independent record labels", "Parlophone, United Artists, Capitol, Apple, Swan, Vee-Jay, Tollie, Atlantic, RCA, Mercury, Koch, Private, Music, Boardwalk, Rykodisc, Hip-O", "Death Row, Interscope", "Arista, J, RCA [1]", "Wildstar (1999–2004), Teacup / Warner Bros. (2005–08), Universal Music TV (2009–10), Atlantic (US, 2001–06), Reprise (US, 2007), Universal Music Publishing Group (2013–present)", "Starday, Mercury, United Artists, RCA Records, Musicor, Epic, MCA Nashville, Asylum, Bandit", "Hannibal Records", "Virgin, Rolling Stones, ABKCO, Universal", "Warner Bros., ECM", "RCA Nashville, Warner Bros. Nashville, Dualtone, Wildcatter, Shanachie", "Columbia, Sony, Blue Note", "Flying Fish, EarthBeat!/Warner Bros. Records, Music For Little People, Rykodisc, Sony Music,", "Warner Alliance, Curb", "Virgin, Eagle"]
	# 	for label in labels
	# 		clause = "MATCH (a:`"+label+"`) REMOVE a:`"+label+"`"
	# 		puts clause.to_s.red

	# 		@neo.execute_query clause
	# 	end
	# end

	def self.set_book_active
		ShelfariBook.update_all(:data_flag => true)
		File.open("/Users/bhuwan/Documents/library/ids2.txt", "r") do |infile|
		    while (line = infile.gets)
		        ids = line.gsub("[", "").gsub("]", "").split(",")
		        for id in ids
		        	puts id.red
		        	ShelfariBook.find(id).update_column("data_flag", nil)
		        end
		    end
		end
	end

	def self.set_genre_linked_list
		neo = self.init
		starting_node = Constants::Id.to_s
		is_done = false
		node_id = starting_node
		while !is_sorted_list_created
			match_clause = "MATCH popularity_list = (book:Book)-[:Next_book*0.." + Constants::QueryStep.to_s + "]->(next_book) WHERE ID = " + node_id.to_s 
			unwind_book_collection_clause = " WITH EXTRACT(n in nodes(popularity_list)|n) AS books UNWIND books as book "
			match_book_to_root_clause = "OPTIONAL MATCH (book)-[:FromCategory]->(category)-[:HasRoot*0..1]->(root_category:Category{is_root:true}) "
			get_last_linked_node_clause = "WITH book, root_category, root_category.uuid AS uuid OPTIONAL MATCH (root_category)-[genre_popularity_list:NextInCategory*]->(popular_book:Book) WHERE NOT(popular_book-[:NextInGenre{from_category:uuid}]-()) "
			conditionally_make_relation_clause = "FOREACH(to_be_ignored IN CASE WHEN genre_popularity_list IS NULL THEN [1] ELSE [] END | MERGE (root_category)-[new_popular:NextInGenre]-(book) ON CREATE SET new_popular.from_category = root_category.uuid) FOREACH(to_be_ignored IN CASE WHEN genre_popularity_list IS NOT NULL THEN [1] ELSE [] END | MERGE (popular_book)-[next_popular:NextInGenre]-(book) ON CREATE SET next_popular.from_category = root_category.uuid) RETURN ID(book) as book_id"
			clause = match_clause + unwind_book_collection_clause + match_book_to_root_clause + get_last_linked_node_clause + conditionally_make_relation_clause 
			neo.execute_query clause
			books_id = neo.execute_query["book_id"].flatten 
			if book_id.include? starting_node then is_sorted_list_created = true end	
		end
	end
end