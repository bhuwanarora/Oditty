class Article::News < Article

	def initialize(user_id)
		@article = "News"		
		@user_id = user_id
	end

	def basic_info
		Article.basic_info  
	end

	def match_news_bookmark 
		match_article_bookmark(@article, @user_id)
	end
end