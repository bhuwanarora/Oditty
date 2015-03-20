class Author < Neo

	def self.initialize name
	end

	def self.get_books
	end

	def self.remove
	end

	def self.is_duplicate
	end

	def self.get_active skip_count=0
		@neo = Neography::Rest.new
		find_active_author = " MATCH (author:Author :ActiveAuthor) WITH author ORDER BY author.priority DESC SKIP " + skip_count.to_s + " LIMIT " + Constants::FollowFavoriteAuthorsCount.to_s
		return_author = " RETURN author.name AS name, author.id AS id"
		clause = find_active_author + return_author
		clause
	end
end