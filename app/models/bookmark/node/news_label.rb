class Bookmark::Node::NewsLabel < Bookmark::Node
	Article = "News"
	def get_public 
		super(Article)
	end

	def get_visited 
		super(Article)
	end

	def self.match_clause
		"MATCH (user:User), (news:News) WHERE ID(user) = " + @user_id.to_s + " AND ID(news) = " + @id.to_s + " "
	end

	def self.optional_match_path
		Bookmark.optional_match_path "news"
	end

	def self.match_path
		Bookmark.match_path "news"
	end

	def self.match_not
		Bookmark.match_not "news"
	end

	def self.match
		super
	end
end