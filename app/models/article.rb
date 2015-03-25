class Article < Bookmark
	def initialize user_id
		@user_id = user_id
	end

	def match_bookmark article
		" MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(article:" + article.to_s + ") WHERE bookmark_node.user_id = " + @user_id.to_s + " "
	end

	def get_feed article
		" MATCH (article:" + article.to_s + ")-[:" + article.to_s + "Feed*0..]->(news_feed) WHERE ID(article) = " + @user_id.to_s + " RETURN labels(news_feed), news_feed "
	end

	def set_bookmark_count operation
		" SET article.bookmark_count = COALESCE(article.bookmark_count,0) " + operation.to_s + " 1 "
	end

	def match article
		" MATCH (article:" + article.to_s + ") WHERE ID(article)=" + @user_id.to_s + " WITH article "
	end

	def self.basic_info
		" ID(article) AS article_id, article.title AS title, article.published_year AS published_year "
	end

	def self.order_desc
		" ORDER BY article.total_weight DESC "
	end

end
