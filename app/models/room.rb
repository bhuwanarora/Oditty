class Room
	def initialize user_id
		@user = User.new(user_id)
	end
	def get_books_from_public_shelves
		books = (@user.match + Bookmark::Node::BookLabel.get_public)
	end

	def get_articles_from_public_shelves
		@user.match + Bookmark::Node::ArticleLabel.get_public 
	end

	def get_visited_books 
		@user.match + Bookmark::Node::BookLabel.get_visited
	end

	def get_visited_articles
		@user.match + Bookmark::Node::ArticleLabel.get_visited 
	end
end