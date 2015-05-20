class Article::NewsArticle < Article
	def initialize id
		@id = id
		@news = News.new(@id)
	end

	def most_important_tag_info
		most_important_community + Community.grouped_books_users
	end

	def self.set_bookmark_count operation
		if operation == "+"
			" SET news.bookmark_count = TOINT(COALESCE(news.bookmark_count, 0)) + 1 "
		else
			" SET news.bookmark_count = TOINT(COALESCE(news.bookmark_count, 1)) - 1 "
		end
	end

	def other_tags_info
		match + ", most_important_tag " + Article::NewsArticle.optional_match_communities + ", most_important_tag ORDER BY has_community.relevance DESC WITH  most_important_tag, " + Community.collect_map("other_tags" => Community.grouped_basic_info) + Article::NewsArticle.return_group(" most_important_tag ", " other_tags[1.." + (Constant::Count::CommunitiesShown+1).to_s + "] AS other_tags ")
	end

	def match 
		" MATCH (news:News) WHERE ID(news)=" + @id.to_s + " WITH news "
	end

	def self.match_communities
		" MATCH (news)-[has_community:HasCommunity]->(community:Community) WITH news, community "
	end

	def self.optional_match_communities
		" OPTIONAL MATCH (news)-[has_community:HasCommunity]->(community:Community) WITH news, community "
	end

	def self.match_communities_with_books
		" MATCH (news)-[has_community:HasCommunity]->(community:Community)-[:RelatedBooks]->(:Book) WITH news, community "
	end
		
	def most_important_community
		match + Article::NewsArticle.match_communities_with_books + " ORDER BY has_community.relevance DESC " + Article::NewsArticle.limit(1) + " WITH community "
	end

	def self.basic_info
		" ID(news) AS news_id, news.title AS title, news.published_year AS published_year "
	end

	def get_chronological_news_info
		match + News.match_chronological_news + @news.match_community + Community.order_desc + Community.return_init + News.basic_info + Community.most_important_category_info 
	end
end