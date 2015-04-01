class Community::Feed < Neo
	def initialize user_id
		@user_id = user_id
	end

	# def delete_feed(object)
	# 	get_feed_relations_for_m = " MATCH (s)-[f1:FeedNext{user_id:"+@user_id.to_s+"}]->("+object+")-[f2:FeedNext{user_id:"+@user_id.to_s+"}]->(e) "
	# 	create_new_relations_in_place = "CREATE (s)-[:FeedNext{user_id:"+@user_id.to_s+"}]->(e) "
	# 	delete_old_relations = "DELETE f1, f2 "
	# 	with_clause = "WITH user, book, "+object
	# 	clause = get_feed_relations_for_m + create_new_relations_in_place + delete_old_relations + with_clause
	# 	clause
	# end

	def create object
		" MATCH (community)-[old:CommunityFeedNext]->(old_feed) CREATE UNIQUE (community)-[:FeedNext{user_id:"+@user_id.to_s+"}]->(" + object + ")-[:FeedNext{user_id:"+@user_id.to_s+"}]->(old_feed) DELETE old WITH community, " + object + " "
	end
end