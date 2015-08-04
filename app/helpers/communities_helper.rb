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
				wiki_url = {}
				communities.each{|community| wiki_url[community['name']] = community['wiki_url']}
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
					params = {:type => "News", :response => news_id}
					IndexerWorker.perform_async(params)

					NewsHelper.map_topics(news_metadata["news_id"], response["Hierarchy"])
					CommunitiesHelper.map_books(communities_books.zip(relevance), news_metadata, wiki_url)
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
		WikiHelper.obtain_wiki_similar_communities communities
	end

	# This funnction first checks the database for books, if no books are present,
	# it calls google api to fetch books	
	def self.fetch_books_database_net community
		clause = Community.search_by_name(community) + Community.match_books + "RETURN book.title,book.author_name"		
		books_list = clause.execute				
		if(books_list.empty?)
			books = CommunitiesHelper.fetch_books community
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

	def self.map_books communities_books, news_metadata, wiki_url = {}
		batch_size_cypher = 4
		communities_books.each do |community_books,relevance|
			community_books.each do |community, books_authors|
				books,authors = books_authors.transpose
				clause =  News.new(news_metadata["news_id"]).match + Community.merge(community, wiki_url[community]) + ", news " + Community.set_importance + " WITH community, news " + News.merge_community(relevance)
	        	clause_temp = clause
				books.each_with_index do |book,i|
					authorlist_string = authors[i].sort.join('').search_ready						
					unique_indices = authors[i].map{|author| (book.search_ready + author.search_ready)}
					clause_temp += Book.search_by_unique_indices(unique_indices) + " , community " + Community.merge_book + " WITH community "
					if((i+1)%batch_size_cypher == 0)
						clause_temp += News.return_init + Community.basic_info
						clause_temp.execute
						clause_temp = clause
					end
				end
				if(clause_temp.length > clause.length)
					clause_temp += News.return_init + Community.basic_info
					clause_temp.execute
				end
				community_info = (clause + Community.return_group(Community.basic_info)).execute[0]
				params = {:type => "Community", :response => community_info["id"]}
				IndexerWorker.perform_async(params)
				if community_info.present? && community_info["image_url"].present? && community_info["id"].present?
					type = "community"
					VersionerWorker.perform_async(community_info["id"], community_info["image_url"], type)
				end
			end
		end
	end

	def self.fetch_books community
		community_books = {community => []}
		count = 0
		books_info = Book::GoogleBooks.get community
		if books_info.present?
			books,author_list = books_info.transpose			
			books.each_with_index do |book,index|				
				if(author_list[index].nil?)					
					next
				end
				authors = author_list[index]			
				authors = authors.sort
				#author_string = authors.join('').search_ready
				#unique_index = book.search_ready + author_string
				books_id = (BookHelper.get_by_one_author(book, authors) + Book.unwind("books") + " RETURN ID(book) AS id").execute
				#book_info = (Book.get_by_unique_index(unique_index).execute)[0]
				if books_id.present? && books_id[0].present? && books_id[0]["id"].present?
					community_books[community] << [book,authors]
					books_id.each do |book_id|
						BookHelper.set_author_list(authors,book_id["id"]).execute
					end
				end
			end
		end		
		community_books
	end

	def self.fetch_book_ids community
		community_books = {community => []}
		count = 0
		books_info = Book::GoogleBooks.get community
		if books_info.present?
			books,author_list = books_info.transpose
			books.each_with_index do |book,index|
				if(author_list[index].nil?)
					next
				end
				authors = author_list[index]
				authors = authors.sort
				books_id = (BookHelper.get_by_one_author(book, authors) + Book.unwind("books") + " RETURN ID(book) AS id").execute
				if books_id.present? && books_id[0].present? && books_id[0]["id"].present?
					books_id.each do |book_id|
						community_books[community] << book_id["id"]
						BookHelper.set_author_list(authors,book_id["id"]).execute
					end
				end
			end
		end
		community_books
	end

	#deletes links to books for all communities before a time_stamp
	def self.get_communities_created_before created_before
		CommunitiesHelper.match_by_creation_time(created_before) + " WITH community "\
		"" + Community.return_group("ID(community) as id", "community.name as name ")
	end

	def self.match_by_creation_time created_before
		"MATCH (community:Community) WHERE community.created_at <= " + created_before.to_s + " "
	end

	def self.delete_community_to_book_links id
		Community.new(id).match + ""\
		"MATCH (community)-[r:RelatedBooks]->(:Book) "\
		"DELETE r "
	end

	def self.create_book_links community_id, community_name
		books = CommunitiesHelper.fetch_book_ids community_name
		books = books[community_name]
		clause = Community.new(community_id).match
		clause += "WHERE community.name = " + "\'" + community_name.gsub("'","\\\\'") + "\'  WITH community "
		or_clause = ""
		books.each_with_index do |book_id,index|
			if index == 0
				or_clause += " ID(book) =" + book_id.to_s + " "
			else
				or_clause += " OR ID(book) =" + book_id.to_s + " "
			end
		end
		if(books.length > 0)
			clause += " MATCH (book:Book) WHERE " + or_clause + Community.merge_book + " RETURN ID(community) "
		else
			clause += " RETURN ID(community)"
		end
		clause
	end

	def self.reset_book_links created_before
		communities = CommunitiesHelper.get_communities_created_before(created_before).execute
		communities.each do |community|
			if(community["name"].present?)
				CommunitiesHelper.delete_community_to_book_links(community["id"]).execute
				CommunitiesHelper.create_book_links(community["id"], community["name"]).execute
			end
		end
	end

	def self.handle_follows_node_feednext_list circular_linked_lists
		clause = ""\
			" MATCH (community)-[:OfCommunity]-(node:FollowsNode) "\
			"" + CircularLinkedListHelper.remove_element(circular_linked_lists,['node', 'community']) + " "\
			" OPTIONAL MATCH (node)-[r]-() "\
			"" + Neo.delete_element_optional_match('r') + ""\
			" DELETE node "
		clause
	end

	def self.handle_bookless_community community_id
		circular_linked_lists = {'FeedNext' => ['user_id']}
		preseve_links_type = ['RootOf']
		clause = ""\
			" MATCH (community:Community) "\
			" WHERE ID(community) = " + community_id.to_s + " "\
			" WITH community "
		if (clause + " MATCH (community)-[:OfCommunity]-(node:FollowsNode)  RETURN ID(node)").execute.present?
			clause += CommunitiesHelper.handle_follows_node_feednext_list(circular_linked_lists)
		end
		clause += ""\
			" WITH community "\
			" OPTIONAL MATCH (community)-[rel]-() "\
			" WHERE NOT (" + preseve_links_type.map{|type| ("TYPE(rel) = \'" + type + "\'")}.join(" OR ") + ") "\
			"" + Neo.delete_element_optional_match("rel") + ""\
			" REMOVE community:Community "\
			" SET community: " + Constant::NodeLabel::BooklessCommunity + " "\
			" RETURN ID(community) AS id"
		begin
			output = clause.execute
			if output.empty?
			puts (" Bookless Community Handling of id: " + community_id.to_s + " unsuccesful").red
		end
		rescue Exception => e
			puts e.to_s.red
		end
	end

	def self.handle_bookless_communities
		local_redis_key = 'bookless_communities_key'
		clause = " MATCH (community:Community) "\
			" WHERE NOT (community)-[:RelatedBooks]->(:Book) "\
			" RETURN ID(community) AS id "
		id_list = clause.execute.map{|elem| elem['id']}
		id_list.each{|community_id| CommunitiesHelper.handle_bookless_community(community_id)}
	end
end