class FacebookLike < CommunityInterface
	def initialize neo_id, app_id = nil
		@app_id = app_id
		@neo_id = neo_id
	end

	def match_by_app_id
		" MATCH (facebook_like:FacebookLike) WHERE facebook_like.app_id = " + @app_id.to_s + " WITH facebook_like "
	end

	def match
		" MATCH (facebook_like:FacebookLike) WHERE ID(facebook_like)=" + @neo_id.to_s + " WITH facebook_like "
	end

	def self.match_books
		" MATCH (facebook_like)-[related_community:RelatedCommunity]->(community:Community)-[relatedbooks:RelatedBooks]->(book:Book) "\
		" WITH facebook_like, community, book, relatedbooks,(CASE WHEN HAS(related_community.relevance) THEN related_community.relevance ELSE 0 END) AS community_relevance "
	end

	def self.match_cover
		" MATCH (facebook_like)-[:FbRelCover]->(cover:Cover) "
	end

	def self.get_image_url
		FacebookLike.match_cover + " WITH facebook_like, cover.source AS image_url "
	end

	def get_combined_details
		match +
		FacebookLike.match_community +
		Community.match_videos + ", community_relevance " +
		FacebookLike.order_by_community_and('video_relevance') +
		FacebookLike.with_group("{#{Video.grouped_basic_info}} AS content", "labels(video) AS labels") +
		FacebookLike.return_group("content", "labels") +
		FacebookLike.limit(4) +
		" UNION ALL " +

		match +
		FacebookLike.match_books +
		" WITH DISTINCT book, community_relevance, " +
		Book.get_goodness_index + FacebookLike.order_by_community_and('goodness_index') +
		FacebookLike.with_group("{#{Book.grouped_basic_info}} AS content", "labels(book) AS labels") +
		FacebookLike.return_group("content", "labels") +
		FacebookLike.limit(4) +
		" UNION ALL " +

		match +
		FacebookLike.match_community + Community.match_news  + ", community_relevance " +
		" WITH news, community, community_relevance " + FacebookLike.order_by_community_and('TOINT(news.created_at)') +" " +
		FacebookLike.with_group("{#{News.grouped_basic_info}} AS content", "labels(news) AS labels") +
		FacebookLike.return_group("content", "labels") +
		FacebookLike.limit(4)
	end

	def self.match_grouped_books
		Community.match_books + ", facebook_like" + 
		FacebookLike.order_by_community_and("") + " WITH community, facebook_like, " + Book.collect_map({"books_info" => Book.grouped_basic_info})
	end

	def get_detailed_info user_id
		clause = match + FacebookLike.match_community +
		" WITH facebook_like AS community " +
		User.new(user_id).match + ", community " +
		UsersCommunity.optional_match  +
		UsersCommunity.set_view_count +
		Community.return_group(UsersCommunity.basic_info, Community.basic_info)
	end

	def get_info user_id
		clause = match + FacebookLike.match_community + Community.match_news + ", facebook_like, community_relevance " +
		" WITH news, community_relevance, facebook_like AS community " + FacebookLike.order_by_community_and("news.timestamp") + " LIMIT 10 WITH community, " +
		 UsersCommunity.collect_map("news" => News.grouped_basic_info) +
		User.new(user_id).match +
		", community, news " +
		UsersCommunity.optional_match  +
		", news "  +
		UsersCommunity.set_view_count +
		Community.return_group(UsersCommunity.basic_info, "news", Community.basic_info)
	end

	def self.grouped_books_users
		" OPTIONAL " + FacebookLike.match_grouped_books +
		" WITH facebook_like AS community, books_info " +
		Community.optional_match_users +
		", books_info WITH DISTINCT user, books_info, community WITH books_info , community, " +
		FacebookLike.collect_map({"users_info" => User.grouped_basic_info }) +
		" WITH users_info, books_info , community, "  +
		FacebookLike.collect_map({"most_important_tag" => Community.grouped_basic_info + ", books: books_info, users: users_info "})
	end

	def books_users_info 
		match + FacebookLike.match_community + FacebookLike.order_by_community_and("") + FacebookLike.grouped_books_users + Community.return_group("most_important_tag", Community.basic_info)
	end

	def get_books
		match + FacebookLike.match_books + " WITH DISTINCT book, community_relevance, " + Book.get_goodness_index + FacebookLike.order_by_community_and('goodness_index') + FacebookLike.limit(Constant::Count::CommunityBooks.to_s) + Neo.return_init + Book.basic_info
	end

	def self.order_by_community_and property
		output = " ORDER BY community_relevance DESC "
		if property.present?
			output += ", " + property + " DESC "
		end
		output
	end

	def get_recent_news skip_count
		match + FacebookLike.match_community + Community.match_news  + ", community_relevance" +
		" WITH news, community, community_relevance " +
		FacebookLike.order_by_community_and("TOINT(news.created_at)") + " SKIP " + skip_count.to_s + " LIMIT 10 WITH community, " + UsersCommunity.collect_map("news" => News.grouped_basic_info) + UsersCommunity.set_view_count + Community.return_group("news")
	end

	def get_old_news skip_count, time
		match + FacebookLike.match_community + FacebookLike.match_news_in_period(time, ['community_relevance'])  + ", community_relevance" +
		" WITH news, community, community_relevance " +
		FacebookLike.order_by_community_and("TOINT(news.created_at)") + " SKIP " + skip_count.to_s + " LIMIT 10 WITH community, " + UsersCommunity.collect_map("news" => News.grouped_basic_info) + UsersCommunity.set_view_count + Community.return_group("news")
	end

	def get_videos
		match + FacebookLike.match_community + Community.match_videos + ", community_relevance " + FacebookLike.order_by_community_and("video_relevance") + Community.return_group(Video.basic_info)
	end

	def self.match_community
		" MATCH (facebook_like:FacebookLike)-[related_community:RelatedCommunity]->(community:Community) "\
		" WITH facebook_like, community, (CASE WHEN HAS(related_community.relevance) THEN related_community.relevance ELSE 0 END) AS community_relevance "
	end

	def merge
		" MERGE (facebook_like:FacebookLike{app_id: " + @app_id + "}) WITH facebook_like "
	end

	def merge_info(category, created_time, name)
		clause = merge
		if category.present?
			clause += FacebookLike.set_category(category)
		end
		clause += FacebookLike.set_name(name)
		clause += FacebookLike.set_created_time(created_time)
		clause
	end

	def self.get_relationship_type field_name
		"FbRel" + field_name.search_ready.camelize + ""
	end

	def self.get_node_label field_name
		field_name.search_ready.camelize + ""
	end

	def self.set_category category
		clause = " SET facebook_like "
		categories = category.split("/")
		categories.each do |category_single|
			clause += ":Fb" + FacebookLike.get_node_label(category_single)
		end
		clause += " SET facebook_like.category = \"" + category.to_s + "\" "
	end

	def self.set_name name
		" SET facebook_like.name = \"" + name.to_s + "\" "
	end

	def self.set_created_time created_time
		" SET facebook_like.created_time = " + created_time.to_s + " "
	end

	def set_completed
		 match + " SET facebook_like.completed = true, facebook_like:Community "
	end

	def self.order_desc
		" ORDER BY likes.timestamp DESC "
	end

	def self.basic_info
		" facebook_like.app_id AS app_id, ID(facebook_like) AS id, facebook_like.name AS name, facebook_like.facebook_url AS facebook_url "
	end

	def self.grouped_basic_info
		" app_id:facebook_like.app_id, id:ID(facebook_like), name:facebook_like.name, facebook_url:facebook_like.facebook_url "
	end

	def get_basic_info
		match + FacebookLike.return_group(FacebookLike.basic_info)
	end

	def self.not_completed
		" WHERE NOT HAS(facebook_like.completed) "\
		" WITH user, facebook_like, likes "
	end

	def self.merge_community relevance, node = 'node'
		clause = " MERGE (" + node + ")-[h:RelatedCommunity]->(community)"\
		" ON CREATE SET h +={relevance: "+ relevance['relevance'].to_s+",relevanceOriginal:"+relevance['relevanceOriginal'].to_s+"}"\
		" ON MATCH  SET h +={relevance: "+ relevance['relevance'].to_s+",relevanceOriginal:"+relevance['relevanceOriginal'].to_s+"}"\
		" WITH "+ node + ",community"
		clause
	end

end