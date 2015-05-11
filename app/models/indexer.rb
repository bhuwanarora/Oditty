class Indexer
	def initialize response
		@response = response
		@client = Elasticsearch::Client.new log: true	

	end

	def self.create_index label, node_class
		get_ids_range_clause = " MATCH (node:#{label}) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		range = get_ids_range_clause.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		puts maximum
		puts minimum
		range = (maximum - minimum) / 1000
		while minimum < maximum
			get_nodes = " MATCH (node:#{label})  WHERE ID(node) <= #{minimum + range} AND ID(node) >= #{minimum} " + Neo.return_init + node_class.basic_info.search_compliant 
			minimum += range
			nodes = get_nodes.execute
			for node in nodes
				Indexer.new([node]).handle
			end
		end
	end

	def handle
		@response = @response[0]
		if @response["label"].include? "Book" 
			index_book
		elsif @response["label"].include? "Blog"
			index_blog
		elsif @response["label"].include? "News"
			index_news
		elsif @response["label"].include? "User"
			index_user
		elsif @response["label"].include? "Author"
			index_author
		elsif @response["label"].include? "Community"
			index_community
		end
	end

	def get_relationships id
		id = id.to_s.strip
		url = "http://localhost:7474/db/data/node/#{id}/relationships/all/"
		puts url		
		relation_count = JSON.parse(Net::HTTP.get(URI.parse(URI.encode(url)))).length
	end
	def index_book 
		@client.index  index: 'search', type: 'book', id: @response["book_id"], body: { title: @response["title"], search_index: @response["search_index"], isbn: @response["isbn"], description: @response["description"], author_name: @response["author_name"] ,weight: get_relationships(@response["book_id"])}
	end	

	def index_blog
		@client.index  index: 'search', type: 'blog', id: @response["blog_id"], body: { title: @response["title"], search_index: @response["indexed_blog_title"],  title: @response["title"], image_url: @response["image_url"], weight: get_relationships(@response["blog_id"])}
	end

	def index_news
		@client.index  index: 'search', type: 'news', id: @response["news_id"], body: { title: @response["title"], search_index: @response["indexed_news_title"], image_url: @response["image_url"], title: @response["title"], created_at: @response["created_at"], weight: get_relationships(@response["news_id"])}
	end	

	def index_user
		@client.index  index: 'search', type: 'user', id: @response["id"], body: { search_index: @response["indexed_user_name"], first_name: @response["first_name"] , last_name: @response["last_name"], region: @response["region"] ,weight: get_relationships(@response["id"])}
	end	

	def index_author
		@client.index  index: 'search', type: 'author', id: @response["author_id"], body: { name: @response["name"], weight: get_relationships(@response["author_id"])}
	end	

	def index_community
		@client.index  index: 'search', type: 'community', id: @response["community_id"], body: { name: @response["name"], search_index: @response["indexed_community_name"], image_url: @response["image_url"], weight: get_relationships(@response["community_id"])}
	end	
end