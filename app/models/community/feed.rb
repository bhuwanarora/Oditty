class Community::Feed < Neo
	def initialize id
		@id = id
	end

	# def delete_feed(object)
	# 	get_feed_relations_for_m = " MATCH (s)-[f1:FeedNext{id:"+@id.to_s+"}]->("+object+")-[f2:FeedNext{id:"+@id.to_s+"}]->(e) "
	# 	create_new_relations_in_place = "CREATE (s)-[:FeedNext{id:"+@id.to_s+"}]->(e) "
	# 	delete_old_relations = "DELETE f1, f2 "
	# 	with_clause = "WITH user, book, "+object
	# 	clause = get_feed_relations_for_m + create_new_relations_in_place + delete_old_relations + with_clause
	# 	clause
	# end

	def create object
		" MATCH (community)-[old:CommunityFeedNext]->(old_feed) CREATE UNIQUE (community)-[:FeedNext{id:"+@id.to_s+"}]->(" + object + ")-[:FeedNext{id:"+@id.to_s+"}]->(old_feed) DELETE old WITH community, " + object + " "
	end

	def delete object
		" MATCH (new)-[l1:FeedNext{id:"+@id.to_s+"}]->(" + object + ")-[l2:FeedNext{id:"+@id.to_s+"}]->(old) CREATE UNIQUE (new)-[:CommunityFeedNext]->(old_feed) DELETE l1, l2 WITH community, " + object + " "
	end
end