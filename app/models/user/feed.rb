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
		@user.match + " MATCH (user)-[:FeedNext*" + skip_count.to_s + "..10]->(feed) RETURN labels(feed) AS labels, feed AS feed"
	end

	def delete_feed(object)
		get_feed_relations_for_m = " MATCH (s)-[f1:FeedNext{user_id:"+@user_id.to_s+"}]->("+object+")-[f2:FeedNext{user_id:"+@user_id.to_s+"}]->(e) "
		create_new_relations_in_place = "CREATE (s)-[:FeedNext{user_id:"+@user_id.to_s+"}]->(e) "
		delete_old_relations = "DELETE f1, f2 "
		with_clause = "WITH user, "+object
		clause = get_feed_relations_for_m + create_new_relations_in_place + delete_old_relations + with_clause
		clause
	end

	def create object
		" MATCH (user)-[old:FeedNext{user_id:" + @user_id.to_s + "}]->(old_feed) CREATE UNIQUE (user)-[:FeedNext{user_id:" + @user_id.to_s + "}]->(" + object + ")-[:FeedNext{user_id:" + @user_id.to_s + "}]->(old_feed) DELETE old WITH user, " + object + " "
	end
end