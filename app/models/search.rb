class Search < Neo
	def initialize params
		@search_text = params[:q]
		@client = Elasticsearch::Client.new log: true	
	end

	def book_by_title
		response = []
		search_response = @client.search index: 'search', type: 'book', scroll: '5m', body: { query: { match: { title: @search_text}} , sort: {'weight'=> {'order' => 'desc'}}}
		search_response["hits"]["hits"].each do |record|
			record["_source"]["label"] = record["_type"].camelcase
			response << record["_source"] 
		end
		response
	end

	def author_by_name
		response = []
		search_response = @client.search index: 'search', type: 'author', scroll: '5m', body: { query: { match: { title: @search_text}} , sort: {'weight'=> {'order' => 'desc'}}}
		search_response["hits"]["hits"].each do |record|
			record["_source"]["label"] = record["_type"].camelcase
			response << record["_source"] 
		end
		response
	end

	def label_by_name
		Search.match_indexed(Constant::IndexName::LabelName, ( @search_text + @connector)) + Search.return_group(Label.basic_info,"labels(node) as labels").search_compliant + Search.skip(@skip_count) + Search.limit(@count)
	end

	def user_by_name
		response = []
		search_response = @client.search index: 'search', type: 'user', scroll: '5m', body: { query: { match: { title: @search_text}} , sort: {'weight'=> {'order' => 'desc'}}}
		search_response["hits"]["hits"].each do |record|
			record["_source"]["label"] = record["_type"].camelcase
			response << record["_source"] 
		end
		response
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
		response = []
		search_response = @client.search index: 'search', type: 'news', scroll: '5m', body: { query: { match: { title: @search_text}} , sort: {'weight'=> {'order' => 'desc'}}}
		search_response["hits"]["hits"].each do |record|
			record["_source"]["label"] = record["_type"].camelcase
			response << record["_source"] 
		end
		response
	end

	def blog_by_title
		response = []
		search_response = @client.search index: 'blog', type: 'blog', scroll: '5m', body: { query: { match: { title: @search_text}} , sort: {'weight'=> {'order' => 'desc'}}}
		search_response["hits"]["hits"].each do |record|
			record["_source"]["label"] = record["_type"].camelcase
			response << record["_source"] 
		end
		response
	end

	def community_by_name
		response = []
		search_response = @client.search index: 'search', type: 'community', scroll: '5m', body: { query: { match: { title: @search_text}} , sort: {'weight'=> {'order' => 'desc'}}}
		search_response["hits"]["hits"].each do |record|
			record["_source"]["label"] = record["_type"].camelcase
			response << record["_source"] 
		end
		response
	end

	def basic
		response = []
		search_response = @client.search index: 'search', scroll: '5m', body: { query: { match: { title: @search_text}} , sort: {'weight'=> {'order' => 'desc'}}}
		search_response["hits"]["hits"].each do |record|
			record["_source"]["label"] = record["_type"].camelcase
			response << record["_source"] 
		end
		response
	end

	def self.basic_search_info
		" CASE WHEN node.title IS NULL THEN node.name ELSE node.title END as name, node.author_name as author_name, ID(node) as id, labels(node) as labels, node.first_name AS first_name, node.last_name AS last_name, node.image_url AS image_url, node.blog_url AS blog_url, node.description AS description, node.created_at AS created_at  " 
	end

	def self.match_indexed index, search_text
		"START node=node:node_auto_index('" + index + ":" + search_text + "') "
	end
end