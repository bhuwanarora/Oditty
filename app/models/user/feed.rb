class User::Feed < User
	def self.get_news_feed(skip_count)
		#FIXME get_news_feed_for_user
		skip_count = 0 unless skip_count.present?
		get_all_ego_relations_through_me = " OPTIONAL MATCH p=(u)-[r:Ego*..1]->(friend:User) "
		filter_relations_only_on_me = "WHERE all(r2 in relationships(p) WHERE r2.user_id="+@user_id.to_s+") WITH friend "
		get_feed_of_my_ego_friends = "MATCH (friend)-[:FeedNext*]->(feed) "
		return_data = "RETURN labels(feed), feed, feed.timestamp ORDER BY toInt(feed.timestamp) DESC SKIP "+skip_count.to_s+" LIMIT 10 "
		clause = _match_user(@user_id) + get_all_ego_relations_through_me + filter_relations_only_on_me + get_feed_of_my_ego_friends + return_data
		clause
	end

	def self.get_personal_feed(skip_count)
		skip_count = 0 unless skip_count.present?
		clause = _match_user(@user_id)+" MATCH (u)-[:FeedNext*]->(feed) RETURN labels(feed), feed, feed.timestamp ORDER BY toInt(feed.timestamp) DESC SKIP "+skip_count.to_s+" LIMIT 10 "
		clause
	end
end