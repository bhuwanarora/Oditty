class Infinity < Neo

	def initialize category_id=nil, author_id=nil, reading_time=nil, era_id=nil
		@category_id = category_id
		@author_id = author_id
		@reading_time = reading_time
		@era_id = era_id
	end

	def get_books
		clause = " "
		with_clause = " WITH book "
		book_label_defined = false
		if @author_id.present?
			with_clause += ", author "
			clause += Infinity::FilterAuthor.new(@author_id).match(book_label_defined) + with_clause
			book_label_defined = true
			trailing_author_clause = ""
			trailing_author_with_clause = ""
		else
			trailing_author_clause = Author.match_path("author", "book", false)
			trailing_author_with_clause = ", author "
		end	

		if @category_id.present?
			with_clause += ", category "
			clause += Infinity::FilterCategory.new(@category_id).match(book_label_defined) + with_clause
			book_label_defined = true
			trailing_category_with_clause = ""
			trailing_category_clause = ""
		else
			trailing_category_clause = Category.match_path
			trailing_category_with_clause = ", category "
		end	

		if @reading_time.present?
			clause += Infinity::FilterReadTime.new(@reading_time).match(book_label_defined) + with_clause
			book_label_defined = true
		end	

		if @era_id.present?
			with_clause += ", era "
			clause += Infinity::FilterEra.new(@era_id).match(book_label_defined) + with_clause
			book_label_defined = true
			trailing_era_clause = ""
			trailing_era_with_clause = ""
		else
			trailing_era_clause = Era.match_path
			trailing_era_with_clause = ", era "
		end	

		clause + trailing_author_clause + (with_clause += trailing_author_with_clause) + trailing_category_clause + (with_clause += trailing_category_with_clause)  + trailing_era_clause + (with_clause += trailing_era_with_clause) + Neo.return_group(Book.basic_info, Author.basic_info, Era.basic_info)  
	end
end