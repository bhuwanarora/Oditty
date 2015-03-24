class Bookmark::Object::Article::Blog < Bookmark::Article
	Article = "Blog"
	def get_public 
		super(Article)
	end

	def get_visited 
		super(Article)
	end
end