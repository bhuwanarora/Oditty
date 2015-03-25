class Bookmark::Node::Article::NewsLabel < Bookmark::Node::Article
	Article = "News"
	def get_public 
		super(Article)
	end

	def get_visited 
		super(Article)
	end
end