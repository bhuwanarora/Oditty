class Bookmark::Node::ArticleLabel < Bookmark::Node

	def self.get_public user_id
		Label.match_public + Label.optional_match_articles + Bookmark::Node::ArticleLabel.return_group("DISTINCT label.name AS shelf", "article AS articles", "label_count AS label_count")
	end

	def self.get_visited
		where_clause = " WHERE label.key = 'Visited' AND ( article:News  OR article:Blog) WITH user, labelled, label, bookmarked_on, bookmark_node, bookmark_action, article, COUNT(label) AS label_count "
		Bookmark::Node::ArticleLabel.optional_match_user + where_clause + Bookmark::Node::ArticleLabel.return_group(Bookmark::Node::ArticleLabel.basic_info )  + ", label_count " + Bookmark::Node::ArticleLabel.order_init + " label_count, created_at DESC " + Bookmark::Node::ArticleLabel.limit(Constant::Count::ArticlesShownInRoom)
	end

	def self.optional_match_user 
		" OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(article) "
	end

	def self.basic_info
		" ID(article) AS article_id, article.title AS title, article.created_at AS created_at, article.image_url as image_url "
	end

	def self.grouped_basic_info
		"article_id: ID(article), title: article.title, created_at: article.created_at, image_url: article.image_url "
	end
end