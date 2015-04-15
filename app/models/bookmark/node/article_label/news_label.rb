class Bookmark::Node::ArticleLabel::NewsLabel < Bookmark::Node::ArticleLabel
	Article = "News"
	def get_public 
		super(Article)
	end

	def get_visited 
		super(Article)
	end
end