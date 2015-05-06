class Search < Neo
	def initialize params
		@search_text = params[:q]
		@count = params[:count] || 4
		@connector = params[:fuzzy].present? ? "~0.7" : "*"
		@skip_count = params[:skip] || 0
	end

	def book_by_title
		Search.match_indexed(Constant::IndexName::BookTitle, ( @params + @connector)) + Search.return_group(Book.detailed_info,"labels(node) as labels").search_compliant + Search.order_by("popularity") + " DESC " + Search.skip(@skip_count) + Search.limit(@count) 
	end

	def author_by_name
		Search.match_indexed(Constant::IndexName::MainAuthorName, ( @search_text + @connector)) + Search.return_group(Author.basic_info,"labels(node) as labels").search_compliant + Search.skip(@skip_count) + Search.limit(@count)
	end

	def label_by_name
		Search.match_indexed(Constant::IndexName::LabelName, ( @search_text + @connector)) + Search.return_group(Label.basic_info,"labels(node) as labels").search_compliant + Search.skip(@skip_count) + Search.limit(@count)
	end

	def user_by_name
		Search.match_indexed(Constant::IndexName::UserName, ( @search_text + @connector)) + Search.return_group(User.basic_info,"labels(node) as labels").search_compliant + Search.skip(@skip_count) + Search.limit(@count)
	end

	def category_by_name
		if @search_text.present?
			clause = Search.match_indexed(Constant::IndexName::CategoryName, ( @search_text + @connector)) + Search.return_group(Category.basic_info,"labels(node) as labels").search_compliant + Search.skip(@skip_count) + Search.limit(@count)
		else
			clause = Category::Root.match_root + Search.return_group(Category.basic_info,"labels(node) as labels")
		end
		clause	
	end

	def news_by_title
		Search.match_indexed(Constant::IndexName::NewsTitle, ( @search_text + @connector)) + Search.return_group(News.basic_info).search_compliant + Search.skip(@skip_count) + Search.limit(@count)
	end

	def blog_by_title
		Search.match_indexed(Constant::IndexName::BlogTitle, ( @search_text + @connector)) + Search.return_group(Blog.basic_info).search_compliant + Search.skip(@skip_count) + Search.limit(@count)
	end

	def community_by_name
		Search.match_indexed(Constant::IndexName::CommunityName, ( @search_text + @connector)) + Search.return_group(Community.basic_info).search_compliant + Search.skip(@skip_count) + Search.limit(@count)
	end

	def basic
		Search.match_indexed(Constant::IndexName::Search, ( @search_text + @connector)) + Search.return_group(Search.basic_search_info) + Search.skip(@skip_count) + Search.limit(@count)
	end

	def self.basic_search_info
		" CASE WHEN node.title IS NULL THEN node.name ELSE node.title END as name, node.author_name as author_name, ID(node) as id, labels(node) as labels, node.first_name AS first_name, node.last_name AS last_name, node.image_url AS image_url, node.blog_url AS blog_url, node.description AS description, node.created_at AS created_at  " 
	end

	def self.match_indexed index, search_text
		"START node=node:node_auto_index('" + index + ":" + search_text + "') "
	end
end