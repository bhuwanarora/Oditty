module CommunitiesHelper
	def self.create news_metadata
		begin
			if(news_metadata["available"]==false)
				return
			end
			communities_books = []		
			relevance = []	 # This is the relevance which we will use			
			response = NewsHelper.fetch_tags news_metadata["news_link"]
			puts response.red
			if response.is_json? 
				response = JSON.parse(response)			
				communities = CommunitiesHelper.handle_communities response						
				skip = 10000
				timer = communities.length * skip -1
				for i in 0..timer do
					if (i % skip) == 0					
						community_books = CommunitiesHelper.fetch_books_database_net(communities[i/skip]['value'])
						temp = community_books[communities[i/skip]['value']]					
						book_name,authors = temp.transpose
						if CommunitiesHelper.has_required_book_count(book_name)						
							relevance << {'relevance' => communities[i/skip]['relevance'],
										'relevanceOriginal' => communities[i/skip]['relevanceOriginal']}
							communities_books << community_books
						end
					end
				end			
				unless communities_books.blank?	
					news_id = News.create(news_metadata).execute[0]["news_id"]
					news_metadata["news_id"] = news_id
					IndexerWorker.perform_async(news_id, "News")

					NewsHelper.map_topics(news_metadata["news_id"], response["Hierarchy"])
					CommunitiesHelper.map_books(communities_books.zip(relevance), news_metadata)
					News.new(news_metadata["news_id"]).add_notification.execute
					if news_metadata.present? && news_metadata["image_url"].present? && news_metadata["news_id"].present?
						type = "news"
						VersionerWorker.perform_async(news_metadata["news_id"], news_metadata["image_url"], type)
					end
				end
			end
		rescue Exception => e			
			puts e.to_s.red
		end
	end

	def self.handle_communities response
		communities = []		
		response["Tags"].each do |social_tag|
			if social_tag['value'] != ""
				communities << social_tag
				
			end
		end
		communities
	end

	# This funnction first checks the database for books, if no books are present,
	# it calls google api to fetch books	
	def self.fetch_books_database_net community
		clause = Community.search_by_name(community) + Community.match_books + "RETURN book.title,book.author_name"		
		books_list = clause.execute				
		if(books_list.empty?)
			books = Community.fetch_books community
		else
			books = {community => []}
			books_list.each do |book|
				if(book.has_key?("book.author_name"))
					author = book["book.author_name"] # it will be array, now it is not
					if(author.nil?)
						next
					end
					books[community] << [book["book.title"],[author[1..author.length]]]
				end
			end			
		end
		books 
	end

	def self.has_required_book_count books
		!books.blank? && books.length >= Constant::Count::MinimumCommunityBooks
	end

	def self.map_books communities_books, news_metadata
		batch_size_cypher = 4 
	    communities_books.each do |community_books,relevance|	    	
	    	community_books.each do |community, books_authors|
	    		books,authors = books_authors.transpose
	        	clause =  News.new(news_metadata["news_id"]).match + Community.merge(community) + ", news " + Community.set_importance + " WITH community, news " + News.merge_community(relevance)					        	
	        	clause_temp = clause
				books.each_with_index do |book,i|
					authorlist_string = authors[i].sort.join('').search_ready						
					unique_index = book.search_ready + authorlist_string
					clause_temp += Book.search_by_unique_index(unique_index) + " , community " + Community.merge_book + " WITH community "
					if((i+1)%batch_size_cypher == 0)
						clause_temp += News.return_init + Community.basic_info
						clause_temp.execute
						clause_temp = clause
					end
				end
				if(clause_temp.length > clause.length)
					clause_temp += News.return_init + Community.basic_info
					community_info = clause_temp.execute[0]
					IndexerWorker.perform_async(community_info["id"], "Community")

					if community_info.present? && community_info["image_url"].present? && community_info["id"].present?
						type = "community"
						VersionerWorker.perform_async(community_info["id"], community_info["image_url"], type)
					end
				end
			end
		end
	end

end