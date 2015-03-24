class Article::Blog < Article
	def initialize(user_id)
		@article = "Blog"
		@user_id = user_id
	end

	def basic_info
		Article.basic_info  
	end

	def match_blog_bookmark 
		match_article_bookmark(@article, @user_id)
	end
end