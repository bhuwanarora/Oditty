class Book::Feed < Neo
	def initialize user_id
		@user_id = user_id
	end

	def create object
		" MATCH (book)-[old:BookFeed]->(old_feed) CREATE UNIQUE (book)-[:BookFeed]->(" + object + ")-[:BookFeed]->(old_feed) DELETE old WITH book, "+object
	end

	def delete_feed(user_id, object)
		get_bookfeed_relations_for_m = "MATCH (s)-[b1:BookFeed]->("+object+")-[b2:BookFeed]->(e) "
		create_new_relations_in_place = "CREATE (s)-[:BookFeed{user_id:"+@user_id.to_s+"}]->(e) "
		delete_old_relations = "DELETE b1, b2 "
		with_clause = "WITH user, book, "+ object + " "
		clause = get_bookfeed_relations_for_m + create_new_relations_in_place + delete_old_relations + with_clause
		clause
	end
end