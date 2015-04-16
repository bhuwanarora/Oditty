class Bookmark::Node::ArticleLabel < Bookmark::Node

	def self.get_public
		where_clause = " WHERE bookmark_node.public = true AND ( article:News  OR article:Blog) WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, article, COUNT(label) AS label_count "
		Bookmark::Node::ArticleLabel.optional_match_user + where_clause + Bookmark::Node::ArticleLabel.return_group(Label.basic_info, Bookmark.basic_info, Bookmark::Node::ArticleLabel.basic_info )  + ", label_count " + Bookmark::Node::ArticleLabel.order_init + " label_count, time DESC " + Bookmark::Node::ArticleLabel.limit(Constant::Count::ArticlesShownInRoom)  
	end

	def self.get_visited
		where_clause = " WHERE bookmark_node.name = 'Visited' AND ( article:News  OR article:Blog) WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, article, COUNT(label) AS label_count "
		Bookmark::Node::ArticleLabel.optional_match_user + where_clause + Bookmark::Node::ArticleLabel.return_group(Label.basic_info, Bookmark.basic_info, Bookmark::Node::ArticleLabel.basic_info )  + ", label_count " + Bookmark::Node::ArticleLabel.order_init + " label_count, time DESC " + Bookmark::Node::ArticleLabel.limit(Constant::Count::ArticlesShownInRoom)
	end

	def self.optional_match_user 
		" OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(article) "
	end

	def self.basic_info
		" ID(article) AS article_id, article.title AS title, article.published_year AS published_year "
	end
end