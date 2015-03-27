module AuthorsHelper
	def self.get_active_authors skip_count 
		@neo = Neography::Rest.new
		find_active_author = " MATCH (author:Author :ActiveAuthor) WITH author ORDER BY author.priority DESC SKIP " + skip_count.to_s + " LIMIT " + Constants::FollowFavoriteAuthorsCount.to_s
		return_author = " RETURN author.name AS name, author.id AS id"
		clause = find_active_author + return_author
		data = @neo.execute_query clause
		data
	end
end
