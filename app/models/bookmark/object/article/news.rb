class Bookmark::Object::Article::News < Bookmark::Object::Article
	Article = "News"
	def get_public 
		super(Article)
	end

	def get_visited 
		super(Article)
	end
end