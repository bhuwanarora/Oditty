class Feed::User < Neo
	def initialize user_id
		@user_id = user_id
	end

	def create object
		" MATCH (user)-[old:FeedNext]->(old_feed) CREATE UNIQUE (user)-[:FeedNext{user_id:"+@user_id.to_s+"}]->(" + object + ")-[:FeedNext{user_id:"+@user_id.to_s+"}]->(old_feed) DELETE old WITH user, "+object
	end
end