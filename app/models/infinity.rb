class Infinity < Neo

	def initialize category_id=nil, author_id=nil, time_id=nil, era_id=nil
		@category_id = category_id
		@author_id = author_id
		@time_id = time_id
		@era_id = era_id
	end

	def get_books
		clause = ""
		with_clause = " WITH book "
		if @author_id.present?
			match_clause = Infinity::FilterAuthor.new(@author_id).match
			clause = clause + match_clause + with_clause
			trailing_author_clause = ""
		else
			trailing_author_clause = Author.match_path("author", "book")
		end	

		if @category_id.present?
			match_clause = Infinity::FilterCategory.match
			clause = clause + match_clause + with_clause
			trailing_category_clause = ""
		else
			trailing_category_clause = Category.match_path
		end	

		if @time_id.present?
			match_clause = Infinity::FilterReadTime.match
			clause = clause + match_clause
			trailing_time_clause = ""
		else
			trailing_time_clause = ReadingTime.match_path
		end	

		if @era_id.present?
			match_clause = Infinity::FilterEra.match
			clause = clause + match_clause
			trailing_era_clause = ""
		else
			trailing_era_clause = Era.match_path
		end	

		clause = clause + with_clause + Author.match_path("author", "book", true) + (with_clause += ", author") + Category.match_path + (with_clause += ", category") + ReadTime.match_path + (with_clause += ", read_time") + Era.match_path + (with_clause += ", era") + Neo.return_group(Book.basic_info, Author.basic_info, Era.basic_info, ReadTime.basic_info)  
	end
end