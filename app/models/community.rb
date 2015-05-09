class Community < Neo

	def initialize id
		@id = id
	end

	def self.grouped_books_users
		Community.match_grouped_books + Community.optional_match_users + ", books_info WITH DISTINCT user, books_info, community WITH books_info , community, " + User.collect_map({"users_info" => User.grouped_basic_info }) + " WITH users_info, books_info , community, "  + Community.collect_map({"most_important_tag" => Community.grouped_basic_info + ", books: books_info, users: users_info " })
	end

	def match
		" MATCH (community:Community) WHERE ID(community) = " + @id.to_s + " WITH community "
	end

	def self.basic_info
		" community.view_count AS view_count, community.name AS name, ID(community) AS id, community.image_url AS image_url, labels(community) AS label, community.search_index AS search_index "
	end

	def self.grouped_basic_info
		"  view_count:community.view_count,  name:community.name, id:ID(community), image_url:community.image_url "
	end

	def books_users_info 
		match + Community.grouped_books_users + Community.return_init + " most_important_tag "
	end

	def self.match_books 
		" MATCH (community)-[:RelatedBooks]->(book:Book) WITH community, book "
	end

	def self.match_news 
		" MATCH (community)<-[:HasCommunity]-(news:News) WITH community, news "
	end

	def get_books
		match + Community.match_books + Book.order_desc + Community.limit(Constant::Count::CommunityBooks.to_s) + Neo.return_init + Book.basic_info
	end

	def self.match_users
		" MATCH (community)<-[of_community:OfCommunity]-(follow_node:FollowNode)<-[follows:Follows]-(user:User) WITH community, follow_node, user "
	end

	def self.optional_match_users
		" OPTIONAL MATCH (community)<-[of_community:OfCommunity]-(follow_node:FollowNode)<-[follows:Follows]-(user:User) WITH community, follow_node, user "
	end

	def self.set_name

	end

	def self.set_importance
		" SET community.importance = COALESCE(community.importance, 0) + 1 "
	end

	def self.detailed_info
		
	end

	def get_users_books
		match + Community.match_users + Community.limit(Constant::Count::CommunityUsers) + Community.return_init + User.basic_info
	end


	def self.get_news
		" MATCH (community)<-[:HasCommunity]-(news:News) WITH community, news "
	end



	def self.set_follow_count operation = "+"
		" SET community.follow_count = COALESCE(community.follow_count,0) #{operation} 1 "
	end

	def self.order_desc
		" ORDER BY community.importance DESC "
	end

	def self.match_grouped_books
		Community.match_books + " WITH community, " + Book.collect_map({"books_info" => Book.grouped_basic_info }) 
	end

	def self.fetch_books community
		community_books = {community => []}
		count = 0
		books = Book::GoogleBooks.get community

		puts books.to_s.green
		if books.present?
			books.each do |book|
				book = book.search_ready
				book_info = (Book.get_by_indexed_title(book).execute)[0] 
				if book_info.present?  
					community_books[community] << book
				end	
			end
		end
		community_books
	end

	def self.most_important_category_info 
		", HEAD(COLLECT({" + Community.grouped_basic_info + "})) AS community_info "
	end

	def self.has_required_book_count books
		!books.blank? && books.length >= Constant::Count::MinimumCommunityBooks
	end


	def self.create news_metadata
		communities_books = []
		response = News.fetch_tags news_metadata["news_link"]
		puts response.red

		if response.is_json? 
			response = JSON.parse(response)
			
			communities = Community.handle_communities response
			puts communities.to_s.yellow

			skip = 10000
			timer = communities.length * skip
			for i in 0..timer do
				if (i % skip) == 0
					community_books = Community.fetch_books(communities[i/skip])
					puts community_books.to_s.green

					if Community.has_required_book_count(community_books[communities[i/skip]])
						communities_books << community_books
					end
				end
				# communities.each do |community|
				# end
			end

			unless communities_books.blank?	
				news_metadata["news_id"] = News.create news_metadata
				News.map_topics(news_metadata["news_id"], response["topics"]) 				
				Community.map_books(communities_books, news_metadata)
			end
		end
	end 

	def self.merge community
		" MERGE (community:Community{indexed_community_name: \"" + community.search_ready + "\"}) ON CREATE SET community.name = \"" + community + "\", community.status = 1, community.created_at=" + Time.now.to_i.to_s + ", community.updated_at=" + Time.now.to_i.to_s + ", community.follow_count = 0, community.image_url = \"" + Community::CommunityImage.new(community).get_image + "\" WITH community "  
	end


	def self.map_books communities_books, news_metadata
	    communities_books.each do |community_books|
	    	community_books.each do |community, books|
	        	clause =  News.new(news_metadata["news_id"]).match + Community.merge(community) + ", news " + Community.set_importance + " WITH community, news " + News.merge_community
				books.each do |book|
					indexed_title = book.search_ready
					clause += Book.search_by_indexed_title(indexed_title) + " , community " + Community.merge_book + " WITH community "
				end
				clause += News.return_init + Community.basic_info
				clause.execute
			end
		end
	end

	def self.merge_book
		" MERGE (community)-[:RelatedBooks]->(book) WITH book, community "
	end

	def self.handle_communities response
		communities = []
		response["social_tags"].each do |social_tag|
			if social_tag["importance"] == Constant::Count::RelevantSocialTag && social_tag["originalValue"] != "" then communities << social_tag["originalValue"] end
		end
		communities
	end

	def self.search_by_name name
		" MATCH (community:Community{name:\"" + name + "\"}) WITH community " 
	end
end