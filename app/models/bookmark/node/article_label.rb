class Bookmark::Node::ArticleLabel < Bookmark::Node

	def self.match 
		" MATCH (article) WHERE article:News  OR article:Blog WITH user, article"  
	end

	def self.get_public
		where_clause = " WHERE bookmark_node.public = true WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, article, COUNT(label) AS label_count "

		self.match + self.match_path + where_clause + self.return_init + self.rating_info + self.basic_info  + self.order_init + " label_count, time DESC " + self.limit(Constants::ArticlesShownInRoomCount)  
	end

	def self.rating_info
		" DISTINCT label.name AS shelf,  bookmark_node.timestamp AS time, "
	end

	def self.get_visited
		where_clause = " WHERE bookmark_node.name = 'Visited' WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, article, COUNT(label) AS label_count "
		self.match + self.match_path + where_clause + self.return_init + self.rating_info + self.basic_info  + self.order_init + " label_count, time DESC " + self.limit(Constants::ArticlesShownInRoomCount)
	end

	def self.match_path 
		" OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(article) "
	end

	def self.basic_info
		" ID(article) AS article_id, article.title AS title, article.published_year AS published_year "
	end
end