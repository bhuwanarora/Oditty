class Indexer
	def initialize response
		@response = response
		@client = Elasticsearch::Client.new log: true	

	end

	def self.create_index 
		get_ids_range_clause = " MATCH (book:Book) RETURN MAX(ID(book)) AS maximum , MIN(ID(book)) AS minimum "
		range = get_ids_range_clause.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		get_books_clause = " MATCH (book:Book) " + Neo.return_init + Book.basic_info + Neo.limit(10000)
		books = get_books_clause.execute
		for book in books
			Indexer.new(book).index_book
		end
	end

	def handle_update
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
		url = "http://localhost:8000/db/data/node/#{id}/relationships/all/"
		puts url		
		relation_count = JSON.parse(Net::HTTP.get(URI.parse(URI.encode(url)))).length
	end
	def index_book 
		@client.index  index: 'search', type: 'book', id: @response["book_id"], body: { title: @response["title"], search_index: @response["search_index"], isbn: @response["isbn"], weight: get_relationships(@response["book_id"])}
	end	

	def index_blog
		@client.index  index: 'search', type: 'blog', id: @response["blog_id"], body: { title: @response["title"], search_index: @response["indexed_blog_title"], weight: get_relationships(@response["blog_id"])}
	end

	def index_news
		@client.index  index: 'search', type: 'news', id: @response["news_id"], body: { title: @response["title"], search_index: @response["indexed_news_title"], weight: get_relationships(@response["news_id"])}
	end	

	def index_user
		@client.index  index: 'search', type: 'user', id: @response["id"], body: { search_index: @response["indexed_user_name"], weight: get_relationships(@response["id"])}
	end	

	def index_author
		@client.index  index: 'search', type: 'author', id: @response["author_id"], body: { title: @response["title"], search_index: @response["search_index"], isbn: @response["isbn"], weight: get_relationships(@response["author_id"])}
	end	

	def index_community
		@client.index  index: 'search', type: 'community', id: @response["community_id"], body: { title: @response["name"], search_index: @response["indexed_community_name"], weight: get_relationships(@response["community_id"])}
	end	
end