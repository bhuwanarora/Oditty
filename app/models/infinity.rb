class Infinity < Neo
	Limit = Constant::Count::BookShownInInfinty
	def initialize filters
		filters = JSON.parse(filters)
		@community_id = filters["community_id"]
		@author_id = filters["author_id"]
		@reading_time_id = filters["reading_time_id"] 
		@era_id = filters["era_id"]
		@skip_count = filters["skip_count"] || 0
	end

	def get_books
		return_group = []
		with_clause = ""

		only_read_time = !@community_id && !@author_id && !@era_id && @reading_time_id.present?
		only_community = !@reading_time_id && !@author_id && !@era_id && @community_id.present?
		if only_read_time
			puts "only_read_time".green
			puts @skip_count
			clause = ReadTime.new(@reading_time_id).match_books_after(@skip_count, Limit) + Infinity.match_community + Infinity.return_group(Infinity.collect_map({"books" => "#{Book.grouped_basic_info}, community: community, description: book.description"}))
		elsif only_community
			with_clause += " ,community "
			puts "only_community".green
			clause = Infinity::FilterCommunity.new(@community_id).get_books(@skip_count, Limit) + Infinity::FilterCommunity.return_group(Infinity::FilterCommunity.collect_map({"books" => "#{Book.grouped_basic_info}, description: book.description"}))
		else
			clause = ""
			book_label_defined = false
			if @author_id.present?
				clause += Infinity::FilterAuthor.new(@author_id).match 
				with_clause += ", author "
				book_label_defined = true
				return_group << Author.basic_info  
			end	

			if @community_id.present?
				clause += Infinity::FilterCommunity.new(@community_id).match + with_clause
				# with_clause += ", genre "
				book_label_defined = true
				# return_group << Community.basic_info
			end	

			if @reading_time_id.present?
				clause += Infinity::FilterReadTime.new(@reading_time_id).match(@skip_count) + with_clause
				book_label_defined = true
			end	

			if @era_id.present?
				clause += Infinity::FilterEra.new(@era_id).match + with_clause
			end

			clause += Infinity.match_community(with_clause)

			if return_group.present?
				clause += Book.order_desc + Infinity.skip(@skip_count) + Infinity.limit(Limit) + Infinity.return_group(Infinity.collect_map({"books" => "#{Book.grouped_basic_info}, description: book.description, community: community"}), return_group) 
			else
				clause += Book.order_desc + Infinity.skip(@skip_count) + Infinity.limit(Limit) + Infinity.return_group(Infinity.collect_map({"books" => "#{Book.grouped_basic_info},  description: book.description, community: community"})) 
			end
		end
		clause
	end

	def self.match_community(with_clause="")
		" OPTIONAL " + Community.match_books + with_clause + " WITH COLLECT (DISTINCT {" + Community.grouped_basic_info + "}) AS community, book " + with_clause
	end
end