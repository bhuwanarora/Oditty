class Infinity < Neo

	def initialize category=nil, author_id=nil, time_id=nil, era_id=nil
		@category = category
		@author_id = author_id
		@time_id = time_id
		@era_id = era_id
	end

	def get_books
		clause = ""
		with_clause = " WITH "
		if @author_id.present?
			match_clause = Infinity::FilterAuthor.new(@author_id).match
			clause = clause + match_clause
			trailing_author_clause = ""
		else
			trailing_author_clause = Author.match_path("author", "book")
		end	

		if @category.present?
			match_clause = Infinity::FilterCategory.match
			clause = clause + match_clause
			with_clause = with_clause == " WITH " ? " category " , ", category "
			trailing_category_clause = ""
		else
			trailing_category_clause = Category.match_path
		end	

		if @time_id.present?
			match_clause = Infinity::FilterTime.match
			clause = clause + match_clause
			with_clause = with_clause == " WITH " ? " time " , ", time "
			trailing_time_clause = ""
		else
			trailing_time_clause = ReadingTime.match_path
		end	

		if @era_id.present?
			match_clause = Infinity::FilterEra.match
			clause = clause + match_clause
			with_clause = with_clause == " WITH " ? " era " , ", era "
			trailing_era_clause = ""
		else
			trailing_era_clause = Era.match_path
		end	

		clause = clause + with_clause
		

	end
end