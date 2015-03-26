class Article::News < Article
	def initialize user_id
		@user_id = user_id
	end

	def match_bookmark 
		" MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(news:News) WHERE bookmark_node.user_id = " + @user_id.to_s + " "
	end

	def get_feed 
		" MATCH (news:News)-[:NewsFeed*0..]->(news_feed) WHERE ID(news) = " + @user_id.to_s + " RETURN labels(news_feed), news_feed "
	end

	def self.set_bookmark_count operation
		" SET news.bookmark_count = COALESCE(news.bookmark_count,0) " + operation + " 1 "
	end

	def match 
		" MATCH (news:News) WHERE ID(news)=" + @user_id.to_s + " WITH news "
	end

	def self.basic_info
		" ID(news) AS blog_id, news.title AS title, news.published_year AS published_year "
	end

	def self.order_desc
		" ORDER BY news.total_weight DESC "
	end
end