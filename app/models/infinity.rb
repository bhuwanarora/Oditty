class Infinity < Neo
	Limit = 30

	def initialize filters
		filters = JSON.parse(filters)
		@category_id = filters["category_id"]
		@author_id = filters["author_id"]
		@reading_time_id = filters["reading_time_id"]
		@era_id = filters["era_id"]
		@skip_count = filters["skip_count"]
	end

	def get_books
		where_clause = ""
		match_clause = ""
		skip_clause = ""

		only_read_time = !@category_id && !@author_id && !@era_id && @reading_time_id.present?
		only_category = !@reading_time_id && !@author_id && !@era_id && @category_id.present?
		if only_read_time
			puts "only_read_time".green
			clause = ReadTime.new(@reading_time_id).match_books_after(@skip_count, Limit)
		elsif only_category
			puts "only_category".green
			clause = Category.new(@category_id).match_books_after(@skip_count, Limit)
		else
			if @era_id.present?
				puts "era_id".green
				init_match_clause = Era.new(@era_id).init_match
			else
				init_match_clause = Book.init_match
			end

			if @author_id.present?
				puts "author_id".green
				@author = Author.new(@author_id)
				match_clause = match_clause + @author.match + @author.match_books
			end
			
			if @category_id
				puts "category_id".green
				@category = Category.new(@category_id)
				match_clause = match_clause + @category.match_books
			end

			# if @genre_id
			# 	match_clause = match_clause + ", (genre:StarGenre)-[r:Belongs_to]->(book) "
			# 	next_where_clause = " ID(genre) = "+genre.to_s+" AND r.weight IS NOT NULL "
			# 	with_clause = with_clause + " ,r.weight as genre_weight " if with_clause.present?
			# 	base_order_clause = " genre_weight DESC, "+base_order_clause if base_order_clause.present?
			# end

			if @reading_time_id.present?
				puts "reading_time".green
				@reading_time = ReadTime.new(@reading_time_id)
				match_clause = match_clause + @reading_time.match_books
			end
			clause = init_match_clause + match_clause
		end
		return_clause = Infinity.return_group(Book.basic_info)

		clause + return_clause + Infinity.limit(Limit)
		#MATCH WHERE WITH RETURN ORDER SKIP LIMIT
		# order_clause = init_order_clause + base_order_clause 	if init_order_clause.present?
		# clause = init_match_clause				
		# clause = clause + match_clause 							if match_clause.present?
		# clause = clause + "WHERE book:ActiveBook AND "+where_clause 				if where_clause.present?
		# clause = clause + with_clause 							if with_clause.present?
		# clause = clause + return_clause 						if return_clause.present?
		# clause = clause + order_clause 							if order_clause.present?
		# clause = clause + skip_clause 							if skip_clause.present?
		# clause = clause + limit_clause 							if limit_clause.present?
		# clause
	end

end