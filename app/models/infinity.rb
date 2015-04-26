class Infinity < Neo

	Limit = Constant::Count::BookShownInInfinty

	def initialize filters
		filters = JSON.parse(filters)
		@category_id = filters["category_id"]
		@author_id = filters["author_id"]
		@reading_time_id = filters["reading_time_id"] 
		@era_id = filters["era_id"]
		@skip_count = filters["skip_count"] || 0

		puts filters.to_s
	end

	def get_books
		return_group = []

		only_read_time = !@category_id && !@author_id && !@era_id && @reading_time_id.present?
		only_category = !@reading_time_id && !@author_id && !@era_id && @category_id.present?
		if only_read_time
			puts "only_read_time".green
			puts @skip_count
			clause = ReadTime.new(@reading_time_id).match_books_after(@skip_count, Limit) + Infinity.return_init + Book.basic_info
		elsif only_category
			puts "only_category".green
			clause = Infinity::FilterCategory.new(@category_id).get_books(@skip_count, Limit)
		else
			clause = ""
			with_clause = ""
			book_label_defined = false
			if @author_id.present?
				clause += Infinity::FilterAuthor.new(@author_id).match 
				with_clause += ", author "
				book_label_defined = true
				return_group << Author.basic_info  
			end	

			if @category_id.present?
				clause += Infinity::FilterCategory.new(@category_id).match(book_label_defined) + with_clause
				with_clause += ", category "
				book_label_defined = true
				return_group << Category.basic_info  
			end	

			if @reading_time_id.present?
				clause += Infinity::FilterReadTime.new(@reading_time_id).match(book_label_defined, @skip_count) + with_clause
				book_label_defined = true
			end	

			if @era_id.present?
				clause += Infinity::FilterEra.new(@era_id).match + with_clause
			end

			if return_group.present?
				clause += Book.order_desc + Infinity.skip(@skip_count) + Infinity.limit(Limit) + Infinity.return_group(Infinity.collect_map({"books" => Book.grouped_basic_info}),return_group) 

			else
				clause += Book.order_desc + Infinity.skip(@skip_count) + Infinity.limit(Limit) + Infinity.return_group(Infinity.collect_map({"books" => Book.grouped_basic_info}))  
			end
		end
		clause
	end
end