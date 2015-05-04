class Bookmark::Node::BlogLabel < Bookmark::Node
	Article = "Blog"

	def self.match_clause
		"MATCH (user:User), (blog:Blog) WHERE ID(user) = " + @user_id.to_s + " AND ID(blog) = " + @id.to_s + " "
	end

	def get_public 
		super(Article)
	end

	def get_visited 
		super(Article)
	end


	def self.match_path
		Bookmark.match_path "blog"
	end

	def self.optional_match_path
		Bookmark.optional_match_path "blog"
	end

	def self.match_not
		Bookmark.match_not "blog"
	end

	def self.match
		super
	end
end