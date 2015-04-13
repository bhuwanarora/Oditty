class Article::BlogArticle < Article
	def initialize user_id
		@user_id = user_id
	end

	def match_bookmark 
		" MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(blog:Blog) WHERE bookmark_node.user_id = " + @user_id.to_s + " "
	end

	def get_feed 
		" MATCH (blog:Blog)-[:BlogFeed*0..]->(news_feed) WHERE ID(blog) = " + @user_id.to_s + " RETURN labels(news_feed), news_feed "
	end

	def self.set_bookmark_count operation
		if operation == "+"
			" SET blog.bookmark_count = TOINT(COALESCE(blog.bookmark_count, 0)) + 1 "
		else
			" SET blog.bookmark_count = TOINT(COALESCE(blog.bookmark_count, 1)) - 1 "
		end
	end

	def match 
		" MATCH (blog:Blog) WHERE ID(blog)=" + @user_id.to_s + " WITH blog "
	end

	def self.basic_info
		" ID(blog) AS blog_id, blog.title AS title, blog.published_year AS published_year "
	end

	def self.order_desc
		" ORDER BY blog.total_weight DESC "
	end

	def self.get_posts
		url = "https://public-api.wordpress.com/rest/v1.1/sites/literaturerun.wordpress.com/posts/?number=10&pretty=1"
		response = Net::HTTP.get(URI.parse(url))
		response
	end

end