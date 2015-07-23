class User::Feed < User

	def initialize user_id
		@user_id = user_id
		@user = User.new @user_id
	end

	def self.create_first
		" CREATE UNIQUE (user)-[feed_next:FeedNext{user_id:ID(user)}]->(user) WITH user, feed_next "
	end

	def get_news_feed(skip_count)
		skip_count = 0 unless skip_count.present?
		get_all_ego_relations_through_me = " OPTIONAL MATCH p=(u)-[r:Ego*..1]->(friend:User) "
		filter_relations_only_on_me = "WHERE all(r2 in relationships(p) WHERE r2.user_id="+@user_id.to_s+") WITH friend "
		get_feed_of_my_ego_friends = "MATCH (friend)-[:FeedNext*]->(feed) "
		return_data = "RETURN labels(feed), feed, feed.timestamp ORDER BY toInt(feed.timestamp) DESC SKIP "+skip_count.to_s+" LIMIT 10 "
		clause = @user.match + get_all_ego_relations_through_me + filter_relations_only_on_me + get_feed_of_my_ego_friends + return_data
		clause
	end

	def get_personal_feed(skip_count)
		skip_count = 0 unless skip_count.present?
		skip_count = skip_count + 1
		@user.match + " MATCH (user)-[:FeedNext*" + skip_count.to_s + ".."+(skip_count + 3).to_s+"{user_id:ID(user)}]->(feed) WHERE feed <> user RETURN DISTINCT(feed) AS feed, labels(feed) AS labels "
	end

	def delete_feed(object)
		" MATCH (s)-[f1:FeedNext{user_id:"+@user_id.to_s+"}]->("+object+")-[f2:FeedNext{user_id:"+@user_id.to_s+"}]->(e) CREATE (s)-[:FeedNext{user_id:"+@user_id.to_s+"}]->(e) DELETE f1, f2  WITH user, " + object + " "
	end

	def delete_feed_optional object, with_elements
		" OPTIONAL MATCH (s)-[f1:FeedNext{user_id:"+@user_id.to_s+"}]->("+object+")-[f2:FeedNext{user_id:"+@user_id.to_s+"}]->(e) "\
		" WITH " + object + with_elements.map{|elem| (", " + elem)}.join("") + ", COLLECT([s,e]) AS path_nodes, COLLECT([f1,f2]) AS path_edges "\
		" FOREACH (elem in (CASE WHEN path_nodes[1] IS NULL THEN [] ELSE path_nodes END )| "\
			"FOREACH (node1 IN [elem[0]] | "\
				" FOREACH (node2 IN [elem[1]] | "\
					" CREATE (node1)-[f1:FeedNext{user_id:"+@user_id.to_s+"}]->(node2) "\
				")"\
			")"\
		")"\
		" FOREACH (elem in (CASE WHEN path_edges[0] IS NULL THEN [] ELSE path_edges END)| "\
			"FOREACH (rel1 IN [elem[0]] | "\
				" FOREACH (rel2 IN [elem[1]] | "\
					" DELETE rel1, rel2 "\
				" )"\
			" )"\
		" )"\
		" WITH " + object + with_elements.map{|elem| (", " + elem)}.join("") + " "
	end

	def create object
		" MATCH (user)-[old:FeedNext{user_id:ID(user)}]->(old_feed) "\
		" CREATE UNIQUE (user)-[:FeedNext{user_id:" + @user_id.to_s + "}]->(" + object + ")-[:FeedNext{user_id:" + @user_id.to_s + "}]->(old_feed) "\
		" DELETE old "\
		" SET user.latest_feed_id = ID(" + object + ")"\
		" WITH user, " + object + " "
	end
end