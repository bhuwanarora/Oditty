class Search < Neo
	def initialize params
		@search_text = params[:q]
		@client = Elasticsearch::Client.new log: true	
		@count = params[:count] || 4
		@connector = params[:fuzzy].present? ? "~0.7" : "*"
		@skip_count = params[:skip] || 0
	end

	def self.extract_info search_response
		response = []
		search_response["hits"]["hits"].each do |record|
			record["_source"]["labels"] = record["_type"].camelcase
			record["_source"]["id"] = record["_id"].to_i
			if record["_source"]["name"].blank?
				record["_source"]["name"] = record["_source"]["title"]
			end
			response << record["_source"] 
		end
		response
	end

	def self.by_scroll_id scroll_id
		client = Elasticsearch::Client.new log: true	
		search_response = client.scroll index: 'search', scroll: '10m', scroll_id: scroll_id.to_s
		{"results" => Search.extract_info(search_response)}
	end

	def book_by_title
		search_response = @client.search index: 'search', type: 'books', scroll: '10m', body:{query:{function_score: {boost_mode: "replace", query:{multi_match:{query:@search_text,fields:["title^2","author_name"]}}}}, sort:{ _script: {params:{factor: 0.4}, type: "number", script: "weight", order: "desc"}}}, analyzer: "autocomplete"
		scroll_id = search_response["_scroll_id"]
		{"scroll_id" => scroll_id, "results" => Search.extract_info(search_response)}
	end

	def author_by_name
		search_response = @client.search index: 'search', type: 'authors', scroll: '10m', body: { query: {match: { name: {query: @search_text, fuzziness: 1}}} , size: 5, sort: [{ _score: { order: "desc" }}, { weight: {order: 'desc'}}]}
		scroll_id = search_response["_scroll_id"]
		{"scroll_id" => scroll_id, "results" => Search.extract_info(search_response)}
	end

	def label_by_name
		Search.match_indexed(Constant::IndexName::LabelName, ( @search_text + @connector)) + Search.return_group(Label.basic_info,"labels(node) as labels").search_compliant + Search.skip(@skip_count) + Search.limit(@count)
	end

	def user_by_name
		search_response = @client.search index: 'search', type: 'users', scroll: '10m', body:{query: {dis_max: { queries: [{match:{first_name:  {query: @search_text, fuzziness: 1}}}, {match:{ last_name: {query: @search_text, fuzziness: 1}}}]}} , size: 5, sort: [{ _score: { order: "desc" }}, { weight: {order: 'desc'}}]}
		scroll_id = search_response["_scroll_id"]
		{"scroll_id" => scroll_id, "results" => Search.extract_info(search_response)}
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
		search_response = @client.search index: 'search', type: 'news', scroll: '10m', body: { query: {match: { title: {query: @search_text, fuzziness: 1}}} , size: 5, sort: [{ _score: { order: "desc" }}, { weight: {order: 'desc'}}]}
		scroll_id = search_response["_scroll_id"]
		{"scroll_id" => scroll_id, "results" => Search.extract_info(search_response)}
	end

	def blog_by_title
		search_response = @client.search index: 'search', type: 'blogs', scroll: '10m', body: { query: {match: { title: {query: @search_text, fuzziness: 1}}} , size: 5, sort: [{ _score: { order: "desc" }}, { weight: {order: 'desc'}}]}
		scroll_id = search_response["_scroll_id"]
		{"scroll_id" => scroll_id, "results" => Search.extract_info(search_response)}
	end

	def community_by_name
		search_response = @client.search index: 'search', type: 'communities', scroll: '10m', body: { query: {match: { name: {query: @search_text, fuzziness: 1}}} , size: 5, sort: [{ _score: { order: "desc" }}, { weight: {order: 'desc'}}]}
		scroll_id = search_response["_scroll_id"]
		{"scroll_id" => scroll_id, "results" => Search.extract_info(search_response)}
	end

	def basic
		search_response = @client.search index: 'search', scroll: '10m', body:{query: { dis_max: { queries: [{match:{title: {query: @search_text, fuzziness: 2}}}, {match:{ author_name: {query: @search_text, fuzziness: 2}}}, {match:{ name: {query: @search_text, fuzziness: 2}}}, { match:{ community_name: {query: @search_text, fuzziness: 2}}}]}} , size: 5, sort: {_script:{script: "doc['weight'].value * factor + doc['_score'].value * (1-factor) ", type: "number", params:{factor: 0.4
            }, order: "desc"}}}
		scroll_id = search_response["_scroll_id"]
		{"scroll_id" => scroll_id, "results" => Search.extract_info(search_response)}
	end

	def self.basic_search_info
		" CASE WHEN node.title IS NULL THEN node.name ELSE node.title END as name, node.author_name as author_name, ID(node) as id, labels(node) as labels, node.first_name AS first_name, node.last_name AS last_name, node.image_url AS image_url, node.blog_url AS blog_url, node.description AS description, node.created_at AS created_at  " 
	end

	def self.match_indexed index, search_text
		"START node=node:node_auto_index('" + index + ":" + search_text + "') "
	end
end