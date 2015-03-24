class Article < Neo
	def initialize id
		@id = id
	end

	def match_article_bookmark article,user_id
		" MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(article:" + article.to_s + ") WHERE bookmark_node.user_id = " + user_id.to_s + " "
	end

	def get_feed article
		" MATCH (article:" + article.to_s + ")-[:" + article.to_s + "Feed*0..]->(news_feed) WHERE ID(article) = " + @id.to_s + " RETURN labels(news_feed), news_feed "
	end

	def set_bookmark_count operation
		" SET article.bookmark_count = COALESCE(article.bookmark_count,0) " + operation.to_s + " 1 "
	end

	def match article
		" MATCH (article:" + article.to_s + ") WHERE ID(article)=" + @id.to_s + " WITH article "
	end

	def self.basic_info
		" ID(article) AS book_id, article.title AS title, article.author_name AS author_name, article.published_year AS published_year, TOINT(article.total_weight) as popularity"
	end

	def self.mark_as_read
		", ID(mark_as_read) AS status"
	end

	def self.rating
		", rating_node.rating AS user_rating"
	end

	def self.detailed_info
		" article.title as title, article.author_name as author_name, ID(article) as book_id, article.readers_count as readers_count, article.bookmark_count as bookmark_count, article.comment_count as comment_count, article.published_year as published_year, article.description as description, article.external_thumb as external_thumb "
	end

	def self.order_desc
		" ORDER BY article.total_weight DESC "
	end

end
