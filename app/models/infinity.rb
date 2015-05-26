class Infinity < Neo
	Limit = Constant::Count::BookShownInInfinty
	def initialize filters
		filters = JSON.parse(filters)
		@category_id = filters["category_id"]
		@author_id = filters["author_id"]
		@reading_time_id = filters["reading_time_id"] 
		@era_id = filters["era_id"]
		@skip_count = filters["skip_count"] || 0
	end

	def get_books
		return_group = []
		with_clause = ""

		only_read_time = !@category_id && !@author_id && !@era_id && @reading_time_id.present?
		only_category = !@reading_time_id && !@author_id && !@era_id && @category_id.present?
		if only_read_time
			puts "only_read_time".green
			puts @skip_count
			clause = ReadTime.new(@reading_time_id).match_books_after(@skip_count, Limit) + Infinity.match_categories + Infinity.return_group(Infinity.collect_map({"books" => "#{Book.grouped_basic_info}, root_categories: root_categories"}))
		elsif only_category
			with_clause += " ,category "
			puts "only_category".green
			clause = Infinity::FilterCategory.new(@category_id).get_books(@skip_count, Limit) + Infinity.match_categories(with_clause) +  Infinity::FilterCategory.return_group(Category.basic_info, Infinity::FilterCategory.collect_map({"books" => "#{Book.grouped_basic_info}, root_categories: root_categories "}))
		else
			clause = ""
			book_label_defined = false
			if @author_id.present?
				clause += Infinity::FilterAuthor.new(@author_id).match 
				with_clause += ", author "
				book_label_defined = true
				return_group << Author.basic_info  
			end	

			if @category_id.present?
				clause += Infinity::FilterCategory.new(@category_id).match + with_clause
				with_clause += ", category "
				book_label_defined = true
				return_group << Category.basic_info  
			end	

			if @reading_time_id.present?
				clause += Infinity::FilterReadTime.new(@reading_time_id).match(@skip_count) + with_clause
				book_label_defined = true
			end	

			if @era_id.present?
				clause += Infinity::FilterEra.new(@era_id).match + with_clause
			end

			clause += Infinity.match_categories(with_clause)

			if return_group.present?
				clause += Book.order_desc + Infinity.skip(@skip_count) + Infinity.limit(Limit) + Infinity.return_group(Infinity.collect_map({"books" => "#{Book.grouped_basic_info}, root_categories: root_categories"}),return_group) 
			else
				clause += Book.order_desc + Infinity.skip(@skip_count) + Infinity.limit(Limit) + Infinity.return_group(Infinity.collect_map({"books" => "#{Book.grouped_basic_info}, root_categories: root_categories"})) 
			end
		end
		clause
	end

	def self.match_categories (with_clause="")
		Category::Root.optional_match_books_root +  with_clause + " WITH COLLECT (DISTINCT " + Category.grouped_basic_info("root_category") + ") AS root_categories, book " + with_clause
	end
end