class Infinity < Neo
	Limit = Constant::Count::BookShownInInfinty
	def initialize filters
		filters = JSON.parse(filters)
		@genre_id = filters["genre_id"]
		@author_id = filters["author_id"]
		@reading_time_id = filters["reading_time_id"] 
		@era_id = filters["era_id"]
		@skip_count = filters["skip_count"] || 0
	end

	def get_books
		return_group = []
		with_clause = ""

		only_read_time = !@genre_id && !@author_id && !@era_id && @reading_time_id.present?
		only_genre = !@reading_time_id && !@author_id && !@era_id && @genre_id.present?
		if only_read_time
			puts "only_read_time".green
			puts @skip_count
			clause = ReadTime.new(@reading_time_id).match_books_after(@skip_count, Limit) + Infinity.match_genres + Infinity.return_group(Infinity.collect_map({"books" => "#{Book.grouped_basic_info}, genres: genres"}))
		elsif only_genre
			with_clause += " ,genre "
			puts "only_genre".green
			clause = Infinity::FilterGenre.new(@genre_id).get_books(@skip_count, Limit) + Infinity::FilterGenre.return_group(Infinity::FilterGenre.collect_map({"books" => "#{Book.grouped_basic_info}"}))
		else
			clause = ""
			book_label_defined = false
			if @author_id.present?
				clause += Infinity::FilterAuthor.new(@author_id).match 
				with_clause += ", author "
				book_label_defined = true
				return_group << Author.basic_info  
			end	

			if @genre_id.present?
				clause += Infinity::FilterGenre.new(@genre_id).match + with_clause
				# with_clause += ", genre "
				book_label_defined = true
				# return_group << Genre.basic_info  
			end	

			if @reading_time_id.present?
				clause += Infinity::FilterReadTime.new(@reading_time_id).match(@skip_count) + with_clause
				book_label_defined = true
			end	

			if @era_id.present?
				clause += Infinity::FilterEra.new(@era_id).match + with_clause
			end

			clause += Infinity.match_genres(with_clause)

			if return_group.present?
				clause += Book.order_desc + Infinity.skip(@skip_count) + Infinity.limit(Limit) + Infinity.return_group(Infinity.collect_map({"books" => "#{Book.grouped_basic_info}, genres: genres"}), return_group) 
			else
				clause += Book.order_desc + Infinity.skip(@skip_count) + Infinity.limit(Limit) + Infinity.return_group(Infinity.collect_map({"books" => "#{Book.grouped_basic_info}, genres: genres"})) 
			end
		end
		clause
	end

	def self.match_genres(with_clause="")
		Genre.optional_match_books + with_clause + " WITH COLLECT (DISTINCT {" + Genre.grouped_basic_info + "}) AS genres, book " + with_clause
	end
end