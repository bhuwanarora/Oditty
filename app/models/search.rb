class Search < Neo
	def initialize params, count=4, fuzzy=nil
		@params = params
		@count = ((count == 0) || count.nil?) ? 4 : count
		@fuzzy = fuzzy
	end

	def book_by_title
		connector = @fuzzy.present? ? "~0.7" : "*"
		Search.match_indexed(Constant::IndexName::BookTitle, @params, connector) + Search.return_group(Book.basic_info).search_compliant + Search.limit(@count)
	end

	def author_by_name
		connector = @fuzzy.present? ? "~0.7" : "*"
		Search.match_indexed(Constant::IndexName::MainAuthorName, @params, connector) + Search.return_group(Author.basic_info).search_compliant + Search.limit(@count)
	end

	def user_by_name
		connector = @fuzzy.present? ? "~0.7" : "*"
		Search.match_indexed(Constant::IndexName::UserName, @params, connector) + Search.return_group(User.basic_info).search_compliant + Search.limit(@count)
	end

	def genre_by_name
		if @params.present?
			clause = Search.match_indexed(Constant::IndexName::CategoryName, @params, connector) + Search.return_group(Category.basic_info).search_compliant + Search.limit(@count)
		else
			clause = Category::Root.match_root + Search.return_group(Category.basic_info)
		end
		clause	
	end

	def basic
		connector = @fuzzy.present? ? "~0.7" : "*"
		Search.match_indexed(Constant::IndexName::Search, @params, connector) + Search.return_group(Book.basic_info,"LABELS(node) AS label", User.basic_info,Category.basic_info,Author.basic_info).search_compliant + Search.limit(@count)
	end
end