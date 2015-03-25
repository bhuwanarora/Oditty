class Bookmark::Object::Article::Blog < Bookmark::Article

	def self.match 
		" MATCH (blog) WHERE blog:News WITH user, blog"  
	end

	def self.get_public
		where_clause = " WHERE bookmark_node.public = true WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, blog, COUNT(label) AS label_count "

		self.new.match + self.new.match_path + where_clause + Neo.new.return_init + self.new.rating_info + self.basic_info  + Neo.new.order_init + " label_count, time DESC " + Neo.new.limit(Constants::ArticlesShownInRoomCount)  
	end

	def rating_info
		select_distinct_properties_clause = " DISTINCT label.name AS shelf,  bookmark_node.timestamp AS time, "
	end

	def self.get_visited
		where_clause = " WHERE bookmark_node.name = 'Visited' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, blog, COUNT(label) AS label_count "
		self.new.match + self.new.match_path + where_clause + Neo.new.return_init + self.new.rating_info + self.basic_info  + Neo.new.order_init + " label_count, time DESC " + Neo.new.limit(Constants::ArticlesShownInRoomCount)
	end

	def match_path 
		" OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(blog) "
	end

	def self.basic_info
		" ID(blog) AS article_id, blog.title AS title, blog.published_year AS published_year "
	end

end