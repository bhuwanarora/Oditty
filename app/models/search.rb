class Search < Neo
	def initialize params, count=4, fuzzy=nil, skip_count = 0
		@params = params
		@count = ((count == 0) || count.nil?) ? 4 : count
		@connector = fuzzy.present? ? "~0.7" : "*"
		@skip_count = skip_count
	end

	def book_by_title
		Search.match_indexed(Constant::IndexName::BookTitle, @params, @connector) + Search.return_group(Book.basic_info).search_compliant + Search.skip(@count) + Search.limit(Constant::Count::ElementsShownInSearch)
	end

	def author_by_name
		Search.match_indexed(Constant::IndexName::MainAuthorName, @params, @connector) + Search.return_group(Author.basic_info).search_compliant + Search.skip(@count) + Search.limit(Constant::Count::ElementsShownInSearch)
	end

	def user_by_name
		Search.match_indexed(Constant::IndexName::UserName, @params, @connector) + Search.return_group(User.basic_info).search_compliant + Search.skip(@count) + Search.limit(Constant::Count::ElementsShownInSearch)
	end

	def genre_by_name
		if @params.present?
			clause = Search.match_indexed(Constant::IndexName::CategoryName, @params, @connector) + Search.return_group(Category.basic_info).search_compliant + Search.skip(@count) + Search.limit(Constant::Count::ElementsShownInSearch)
		else
			clause = Category::Root.match_root + Search.return_group(Category.basic_info)
		end
		clause	
	end

	def basic
		Search.match_indexed(Constant::IndexName::Search, @params, @connector) + Search.return_group(Search.basic_search_info) + Search.skip(@count) + Search.limit(Constant::Count::ElementsShownInSearch)
	end
end