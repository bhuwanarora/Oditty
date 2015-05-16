class Indexer
	def initialize response
		@response = response
		@client = Elasticsearch::Client.new log: true	

	end

	def self.set_index
		client = Elasticsearch::Client.new log: true	
		if (client.indices.exists_alias name: 'search')
			indices = client.indices.get_alias name: 'search'
			indices.each do |key, value|
				client.indices.update_aliases body: {
				  actions: [
				    { remove: { index: key, alias: 'search' } },
				  ]
				}
			end
		end
		
		if client.indices.exists index: Time.now.strftime("%D").gsub("/","-")
			client.indices.delete index: Time.now.strftime("%D").gsub("/","-")
		end

		client.indices.create index: Time.now.strftime("%D").gsub("/","-"),
		body: 
			{settings:
				{index:
					{number_of_shards: 1,
                    number_of_replicas: 0,
                  	},
				analysis: 
					{filter:
						{autocomplete_filter:
                			{type:"edge_ngram",
		                    min_gram: "3",
		                    max_gram: "12",
		                    side: "front",
		                    token_chars: [ "letter", "digit", "punctuation", "symbol"]
	                		}
	         			},
	            	analyzer:
	            		{autocomplete:
	            			{type: "custom",
	                    	tokenizer: "standard",
	                    	filter: ["lowercase", "standard", "autocomplete_filter"]
	                		},
						whitespace: 
							{type: "custom",
		               		tokenizer: "whitespace",
		               		filter: ["lowercase","asciifolding"]
		            		}
		            	},
		            tokenizer: 
		            	{edge_ngram_tokenizer: 
		            		{type: "edgeNGram",
			                min_gram: "2",
			                max_gram: "12",
			                token_chars: [ "letter", "digit" ]
              				}
          				}
	                }
	            },
			mappings: 
				{books:
					{_all:
						{index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
						 },
			        properties:
			         	{description:
			         		{type: "string",
			               	index: "no"
			            	},
			            title:
			            	{type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			               	},
			            author_name:
			            	{type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			               	}
			            }
                	},
				blogs:
					{_all:
						{index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
						 },
			        properties:
			         	{excerpt:
			         		{type: "string",
			               	index: "no"
			            	},
			        	title:
			            	{type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			               	}
		            	}
                	},
				news:
					{_all:
						{index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
						 },
			        properties:
			         	{description:
			         		{type: "string",
			               	index: "no"
			            	},
			        	title:
			            	{type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			               	}
			            }
                	},				
				authors:
					{_all:
						{index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
						},
			        properties:
			         	{name:
			         		{type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            	}
			            }
                	},				
				communities:
					{_all:
						{index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
						},
			        properties:
			         	{name:
			         		{type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            	}
			            }
                	},				
				users:
					{_all:
						{index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
						},
			        properties:
			         	{first_name:
			         		{type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            	},
			            last_name:
			         		{type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            	}
			            }
                	}				
                }
			}

		client.indices.put_alias index: Time.now.strftime("%D").gsub("/","-"), name: 'search'			
	end

	def self.create_index label, node_class
		get_ids_range_clause = " MATCH (node:#{label}) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		range = get_ids_range_clause.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		puts maximum
		puts minimum
		range = (maximum - minimum) / 500
		while minimum < maximum
			get_nodes = " MATCH (node:#{label})  WHERE ID(node) <= #{minimum + range} AND ID(node) >= #{minimum} " + Neo.return_init + node_class.basic_info.search_compliant 
			minimum += range
			nodes = get_nodes.execute
			for node in nodes
				Indexer.new([node]).handle
			end
		end
	end

	def self.create_index_books 
		label = "Book"
		node_class = Book
		get_ids_range_clause = " MATCH (node:#{label}) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		range = get_ids_range_clause.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		puts maximum
		puts minimum
		range = (maximum - minimum) / 500
		while minimum < maximum
			get_nodes = " MATCH (node:#{label})  WHERE ID(node) <= #{minimum + range} AND ID(node) >= #{minimum} " + Neo.return_init + node_class.basic_info.search_compliant + ", node.description AS description "
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

	def get_relationship_count id
		id = id.to_s.strip
		url = "#{Rails.application.config.neo4j_url}/db/data/node/#{id}/relationships/all/"
		puts url 		
		relation_count = JSON.parse(Net::HTTP.get(URI.parse(URI.encode(url)))).length
	end
	
	def index_book 
		@client.index  index: 'search', type: 'books', id: @response["book_id"], body: { title: @response["title"], isbn: @response["isbn"], description: @response["description"], author_name: @response["author_name"] ,weight: get_relationship_count(@response["book_id"])}
	end	

	def index_blog
		@client.index  index: 'search', type: 'blogs', id: @response["blog_id"], body: { title: @response["title"], excerpt: @response["excerpt"],  title: @response["title"], image_url: @response["image_url"], weight: get_relationship_count(@response["blog_id"])}
	end

	def index_news
		@client.index  index: 'search', type: 'news', id: @response["id"], body: { title: @response["title"], description: @response["description"], image_url: @response["image_url"], title: @response["title"], created_at: @response["created_at"], weight: get_relationship_count(@response["id"])}
	end	

	def index_user
		@client.index  index: 'search', type: 'users', id: @response["id"], body: { search_index: @response["indexed_user_name"], first_name: @response["first_name"] , last_name: @response["last_name"], region: @response["region"] ,weight: get_relationship_count(@response["id"])}
	end	

	def index_author
		@client.index  index: 'search', type: 'authors', id: @response["id"], body: { name: @response["name"], weight: get_relationship_count(@response["id"])}
	end	

	def index_community
		@client.index  index: 'search', type: 'communities', id: @response["id"], body: { name: @response["name"], image_url: @response["image_url"], weight: get_relationship_count(@response["id"])}
	end	
end