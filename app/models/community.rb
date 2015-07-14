class Community < Neo

	def initialize id
		@id = id
	end

	def self.grouped_books_users
		Community.optional_match_grouped_books + Community.optional_match_users + ", books_info WITH DISTINCT user, books_info, community WITH books_info , community, " + User.collect_map({"users_info" => User.grouped_basic_info }) + " WITH users_info, books_info , community, "  + Community.collect_map({"most_important_tag" => Community.grouped_basic_info + ", books: books_info, users: users_info "})
	end

	def match
		" MATCH (community:Community) WHERE ID(community) = " + @id.to_s + " WITH community "
	end

	def self.match
		" MATCH (community:Community) WITH community "
	end

	def get_news skip_count=0
		match + Community.match_news  + " WITH news, community ORDER BY TOINT(news.timestamp) DESC SKIP "+skip_count.to_s+" LIMIT 10 WITH community, " +  UsersCommunity.collect_map("news" => News.grouped_basic_info) + UsersCommunity.set_view_count + Community.return_group("news", Community.basic_info)
	end

	def self.basic_info
		" community.view_count AS view_count, community.name AS name, ID(community) AS id, community.image_url AS image_url, labels(community) AS label, community.follow_count AS follow_count "
	end

	def get_basic_info
		match + Community.return_group(Community.basic_info)
	end

	def self.grouped_basic_info
		" view_count:community.view_count,  name:community.name, id:ID(community), image_url:community.image_url "
	end

	def books_users_info 
		match + Community.grouped_books_users + Community.return_init + " most_important_tag "
	end

	def feed_info
		match + Community.return_group(Community.basic_info)
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
		" MATCH (community)<-[of_community:OfCommunity]-(follow_node:FollowsNode)<-[follows:Follows]-(user:User) WITH community, follow_node, user "
	end

	def self.optional_match_users
		" OPTIONAL MATCH (community)<-[of_community:OfCommunity]-(follow_node:FollowsNode)<-[follows:Follows]-(user:User) WITH community, follow_node, user "
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

	def self.optional_match_grouped_books
		" OPTIONAL " + Community.match_grouped_books
	end

	def self.match_grouped_books
		Community.match_books + " WITH community, " + Book.collect_map({"books_info" => Book.grouped_basic_info})
	end

	def self.most_important_category_info 
		", HEAD(COLLECT({" + Community.grouped_basic_info + "})) AS community_info "
	end

	def self.merge community, wiki_url = ""
		clause = " MERGE (community:Community{indexed_community_name: \"" + community.search_ready + "\"}) "\
		" ON CREATE SET "\
		" community.name = \"" + community + "\", "\
		" community.status = 1, "\
		" community.created_at=" + Time.now.to_i.to_s + ", "\
		" community.updated_at=" + Time.now.to_i.to_s + ", "\
		" community.follow_count = 0, "\
		" community.image_url = \"" + Community::CommunityImage.new(community).get_image + "\" "
		if !wiki_url.nil? && !wiki_url.empty?
			clause += ", community.wiki_url = \"" + wiki_url + "\" "\
				" ON MATCH SET "\
				" community.wiki_url = \"" + wiki_url + "\" "
		end
		clause += " WITH community "
	end

	def self.merge_book
		" MERGE (community)-[:RelatedBooks]->(book) WITH book, community "
	end

	def self.search_by_name name
		" MATCH (community:Community{name:'" + name + "'}) WITH community " 
	end

	def self.top_communities user_id, skip_count=0
		" MATCH (community:Community) WITH community " + Community.return_init + Community.basic_info + Community.order_by("community.follow_count, community.view_count DESC ") + Community.skip(skip_count) + Community.limit(Constant::Count::CommunitiesSuggested) 
	end

	def self.suggest_communities user_id, skip_count = 0
		User.new(user_id).match + Bookmark::Node::NewsLabel.optional_match_path + " WHERE news: News WITH news, user, bookmark_node " + News.match_community + ", user, bookmark_node " + UsersCommunity.where_not + " WITH DISTINCT community, SUM(COALESCE(has_community.relevance,0)) AS relevance_sum , SUM(COALESCE(has_community.relevance,0)*COALESCE(bookmark_node.count,0)) AS total_relevance ORDER BY total_relevance, relevance_sum  DESC SKIP " + skip_count.to_s + Community.limit(Constant::Count::CommunitiesSuggested) + Community.return_group(Community.basic_info, "total_relevance", "relevance_sum")
	end

	def self.get_popular skip_count = 0
		Community.match + Community.return_group(Community.basic_info) + Community.order_by("follow_count DESC") + Community.limit(10)
		# Community.match_news + Bookmark::Node::NewsLabel.optional_match_path + Community.return_group(Community.basic_info, "COUNT(news) as news_count", "COUNT(bookmark_node) as bookmark_count") + Community.order_by("bookmark_count DESC , news_count DESC") + Community.skip(skip_count) + Community.limit(10)
	end

	def get_books_users
		match + Community.grouped_books_users 
	end

	def match_news_related_communities news_id
		News.new(news_id).match + ", most_important_tag " + News.optional_match_community + " , most_important_tag  WHERE NOT ID(community) = " + @id.to_s + " WITH most_important_tag, community, has_community ORDER BY has_community.relevance DESC WITH  most_important_tag, " + Community.collect_map("other_tags" => Community.grouped_basic_info) + Article::NewsArticle.return_group(" most_important_tag ", " other_tags[0.." + (Constant::Count::CommunitiesShown+1).to_s + "] AS other_tags ")
	end

	# def get_news skip_count = 0
	# 	match + Community.match_news +  Community.order_init + " news.created_at DESC " + Community.skip(skip_count) + Community.limit(10) + " WITH community, " + Community.collect_map("news" => News.grouped_basic_info) + Community.return_group(" news", Community.collect_map("community" => Community.grouped_basic_info))
	# end

end