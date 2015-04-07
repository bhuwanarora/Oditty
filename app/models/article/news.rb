class Article::News < Article
	def initialize id
		@id = id
	end

	def most_important_tag_info
		most_important_community + Community.match_grouped_books + Community.match_users + ", books_info WITH user, books_info , community " + User.collect_map({"users_info" => User.grouped_basic_info })  + " WITH users_info, books_info , community " + Community.collect_map({"most_important_tag" => Community.grouped_basic_info + ", books: books_info, users: users_info" })
	end

	def match_bookmark 
		# " MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(news:News) WHERE bookmark_node.user_id = " + @user_id.to_s + " "
	end

	def get_feed 
		# " MATCH (news:News)-[:NewsFeed*0..]->(news_feed) WHERE ID(news) = " + @user_id.to_s + " RETURN labels(news_feed), news_feed "
	end

	def self.set_bookmark_count operation
		if operation == "+"
			" SET news.bookmark_count = TOINT(COALESCE(news.bookmark_count, 0)) + 1 "
		else
			" SET news.bookmark_count = TOINT(COALESCE(news.bookmark_count, 1)) - 1 "
		end
	end

	def other_tags_info
		match + ", most_important_tag " + Article::News.match_communities + ", most_important_tag " +  Community.order_desc + " WITH most_important_tag " + Community.tail("community")  + " WITH  most_important_tag  " + Community.collect_map("other_tags" => Community.grouped_basic_info) + Article::News.return_group(" most_important_tag ", " other_tags ")     
	end

	def match 
		" MATCH (news:News) WHERE ID(news)=" + @id.to_s + " WITH news "
	end

	def self.match_communities
		" MATCH (news)-[:HasCommunity]->(community:Community) WITH news, community "
	end

	def most_important_community
		match + Article::News.match_communities + Community.order_desc + Article::News.limit(1) + " WITH community "
	end

	def self.basic_info
		" ID(news) AS news_id, news.title AS title, news.published_year AS published_year "
	end

	def self.order_desc
		# " ORDER BY news.total_weight DESC "
	end

	def get_chronological_news_info
		match + ::News.match_chronological_news + ::News.new(@id).match_community + Community.order_desc + Article::News.limit(1) + Community.return_init + Community.basic_info 
	end
end