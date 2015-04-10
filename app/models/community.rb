class Community < Neo

	def initialize id
		@id = id
	end

	def self.grouped_books_users
		Community.match_grouped_books + Community.optional_match_users + ", books_info WITH books_info , community " + User.collect_map({"users_info" => User.grouped_basic_info })  + " WITH users_info, books_info , community " + Community.collect_map({"most_important_tag" => Community.grouped_basic_info + ", books: books_info, users: users_info" })
	end

	def match
		" MATCH (community:Community) WHERE ID(community) = " + @id.to_s + " WITH community "
	end

	def self.basic_info
		" community.view_count AS view_count, community.name AS name "
	end

	def self.grouped_basic_info
		"  view_count:community.view_count,  name:community.name "
	end

	def books_users_info
		match + Community.grouped_books_users + Community.return_init + " most_important_tag "
	end

	def self.grouped_basic_info
		"  view_count:community.view_count ,  name:community.name  "
	end

	def self.match_books 
		" MATCH (community)-[:RelatedBooks]->(book:Book) WITH community, book "
	end

	def get_books
		match + Community.match_books + Book.order_desc + Community.limit(Constants::CommunityBooksCount.to_s) + Neo.return_init + Book.basic_info
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
		match + Community.match_users + Community.limit(Constants::CommunityUsersCount) + Community.return_init + User.basic_info
	end


	def self.get_news
		" MATCH (community)<-[:HasCommunity]-(news:News) WITH community, news "
	end



	def self.set_follow_count
		" SET community.follow_count = COALESCE(community.follow_count,0) + 1 "
	end

	def self.order_desc
		" ORDER BY community.importance DESC "
	end

	def self.match_grouped_books
		Community.match_books + " WITH community " + Book.collect_map({"books_info" => Book.grouped_basic_info }) 
	end

	def self.get_google_books community
		community_books = {community => []}
		count = 0
		begin
			Google::Search::Book.new(:query => community).each do |book|
				count += 1
				if count == Constants::MaximumCommunityBooksCount
					break
				end
				community_books[community] << book.title.search_ready
			end
		rescue Exception => e
			puts e.to_s.red
			community_books = {}
		end
		community_books
	end

	def self.most_important_category_info 
		", HEAD(COLLECT({" + Community.grouped_basic_info + "})) AS community_info "
	end

	def self.has_required_book_count books
		!books.blank? && books.length >= Constants::MinimumCommunityBooksCount
	end


	def self.create news_link, news_source
		communities_books = []

		response = News.fetch_tags news_link
		puts response.red

		if response.is_json? 
			response = JSON.parse(response)
			
			communities = Community.handle_communities response
			puts communities.to_s.yellow

			communities.each do |community|
				community_books = Community.get_google_books(community)
				puts community_books.to_s.green

				if Community.has_required_book_count(community_books[community])
					communities_books << community_books
				end
			end

			unless communities_books.blank?	
				news_id = News.create news_link, news_source
				news_info = {"news_id" => news_id, "news_source" => news_source, "news_link" => news_link}
				
				if News.news_already_present(news_info["news_id"]) 
					News.map_topics(news_info["news_id"], response["topics"]) 				
					Community.map_books(communities_books, news_info)
				end

			end
		end
	end 

	def self.map_books communities_books, news_info
	    communities_books.each do |community_books|
	    	community_books.each do |community, books|
	        	clause =  News.new(news_info["news_id"]).match + " MERGE (community:Community{name: \"" + community + "\"}) ON CREATE SET community.status = 1, community.timestamp=" + Time.now.to_i.to_s + ", community.url = \"" + news_info["news_source"]["news_link"].to_s + "\", community.location = \"" + news_info["news_source"]["region"].to_s + "\" " + Community.set_importance + " MERGE (news)-[:HasCommunity]->(community) WITH community "
				books.each do |book|
					indexed_title = book.search_ready
					clause += " START book=node:node_auto_index('indexed_title:\""+indexed_title+"\"') MERGE (community)-[:RelatedBooks]->(book) WITH community "
				end

				clause+= News.return_init + Community.basic_info
				clause.execute
			end
		end
	end

	def self.handle_communities response
		communities = []
		response["social_tags"].each do |social_tag|
			if social_tag["importance"] == Constants::RelevantSocialTagValue then communities << social_tag["originalValue"] end
		end
		communities
	end
end