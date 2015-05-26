class Indexer
	def initialize response
		@response = response
		@client = Elasticsearch::Client.new log: true	
		@filename = Constant::Filename::IndexerLogs
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
		
		if client.indices.exists index: Time.now.strftime("%D").gsub("/", "-")
			client.indices.delete index: Time.now.strftime("%D").gsub("/", "-")
		end

		client.indices.create index: Time.now.strftime("%D").gsub("/", "-"),
		body:{
			settings:{
				index:{
					number_of_shards: 1,
                    number_of_replicas: 0,
                },
				analysis:{
					filter:{
						autocomplete_filter:{
							type:"edge_ngram",
		                    min_gram: "3",
		                    max_gram: "12",
		                    token_chars: [ "letter", "digit", "punctuation", "symbol"]
	                	}
	         		},
	            	analyzer:{
	            		autocomplete:{
	            			type: "custom",
	                    	tokenizer: "standard",
	                    	filter: ["standard", "autocomplete_filter"]
	                	}
		            }
	            }
	        },
			mappings:{
				books:{
					_all:{
						index_analyzer: "autocomplete",
		            	search_analyzer: "autocomplete"
					 },
			        properties:{
		         		description:{
		         			type: "string",
		               		index: "no"
		            	},
		            	title:{
		            		type: "string",
							index: "analyzed",
                        	analyzer: "autocomplete"
		               	},
		            	author_name:{
		            		type: "string",
							index: "analyzed",
                        	analyzer: "autocomplete"
		               	},
			            author_id:{
			            	type: "integer",
			            	index: "no"
			            },
			            weight:{
			            	type: "integer",
			            	index: "no"
			            }
			        },
               	},
				blogs:{
					_all:{
						index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
					},
			        properties:{
			        	excerpt:{
			        		type: "string",
			               	index: "no"
			            },
			            image_url:{
			        		type: "string",
			               	index: "no"
			            },
			            weight:{
			            	type: "integer",
			            	index: "no"
			            },
			            blog_url:{
			            	type: "string",
			            	index: "no"
			            },
			            posted_at:{
			            	type: "integer",
			            	index: "no"
			            },
			        	title:{
			        		type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            }
		            }
                },
				news:{
					_all:{
						index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
					},
			        properties:{
			        	description:{
			        		type: "string",
			               	index: "no"
			            },
			        	title:{
			        		type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            },
			            image_url:{
			            	type: "string",
			            	index: "no"
			            },
			            created_at:{
			            	type: "integer",
			            	index: "no"
			            },
			            weight:{
			            	type: "integer",
			            	index: "no"
			            }
			        }
               	},				
				authors:{
					_all:{
						index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
					},
			        properties:{
			        	name:{
			        		type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            },
			            weight:{
			            	type: "integer",
			            	index: "no"
			            },
			            location:{
			            	type: "string",
			            	index: "no"
			            }
			        }
                },				
				communities:{
					_all:{
						index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
					},
			        properties:{
			        	name:{
			         		type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            },
			            image_url:{
			            	type: "string",
			            	index: "no"
			            },
			            weight:{
			            	type: "integer",
			            	index: "no"
			            },
			            overview:{
			            	type: "string",
			            	index: "no"
			            }
			        }
                },				
				users:{
					_all:{
						index_analyzer: "autocomplete",
			            search_analyzer: "autocomplete"
					},
			        properties:{
			        	first_name:{
			        		type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            },
			            last_name:{
			            	type: "string",
							index: "analyzed",
	                        analyzer: "autocomplete"
			            },
			            weight:{
			            	type: "integer",
			            	index: "no"
			            },
			            region:{
			            	type: "string",
			            	index: "no"
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

	def get_relationship_count
		clause = "MATCH (node)-[r]-() WHERE ID(node)="+id+" RETURN COUNT(node) AS count"
		clause.execute[0]
	end

	def index_book
		begin
			authors = [] 
			relationships = get_relationships(@response["book_id"])
			clause = Book.match_author + Book.return_group(Author.primary_info)
			authors = clause.execute

			author_name = authors.present? ? authors.first["name"] : "null" 
			author_id =  authors.present? ? authors.first["id"] : "null"
			body = {
					title: @response["title"], 
					description: @response["description"],
					isbn: @response["isbn"], 
					author_name: author_name, 
					author_id: author_id, 
					weight: get_relationship_count(@response["book_id"])["count"]
				}
			@client.index  index: 'search', type: 'books', id: @response["book_id"], body: body
		rescue Exception => e
			puts e.to_s.red
			message = "#{e} for id #{@response["book_id"]} at #{ Time.now.strftime("%D")}"
			File.open(@filename, 'a') { |file| file.puts(message) }
		end
	end	

	def index_blog
		body = { 
				title: @response["title"], 
				excerpt: @response["excerpt"], 
				image_url: @response["image_url"], 
				weight: get_relationship_count(@response["blog_id"])["count"],
				blog_url: @response["blog_url"],
				posted_at: @response["posted_at"]
			}
		@client.index  index: 'search', type: 'blogs', id: @response["blog_id"], body: body
	end

	def index_news
		body = {
			title: @response["title"], 
			description: @response["description"], 
			image_url: @response["image_url"], 
			created_at: @response["created_at"], 
			weight: get_relationship_count(@response["id"])["count"]
		}
		@client.index  index: 'search', type: 'news', id: @response["id"], body: body
	end	

	def index_user
		body = {
			first_name: @response["first_name"], 
			last_name: @response["last_name"], 
			region: @response["region"],
			weight: get_relationship_count(@response["id"])["count"]
		}
		@client.index  index: 'search', type: 'users', id: @response["id"], body: body
	end	

	def index_author
		body = {
			name: @response["name"], 
			weight: get_relationship_count(@response["id"])["count"],
			overview: @response["overview"],
			location: @response["location"]
		}
		@client.index  index: 'search', type: 'authors', id: @response["id"], body: body
	end	

	def index_community
		body = {
			name: @response["name"], 
			image_url: @response["image_url"], 
			weight: get_relationship_count(@response["id"])["count"]
		}
		@client.index  index: 'search', type: 'communities', id: @response["id"], body: body
	end

	def create_index type, body
		@client.index  index: 'search', type: type, id: @response["id"], body: body	
	end
end