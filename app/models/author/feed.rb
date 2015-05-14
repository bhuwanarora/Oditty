class Author::Feed < Neo
	def initialize author_id
		@author_id = author_id
		@author = Author.new @author_id
	end

	def delete_feed(object)
		" MATCH (s)-[f1:AuthorFeedNext{author_id:"+@author_id.to_s+"}]->("+object+")-[f2:AuthorFeedNext{author_id:"+@author_id.to_s+"}]->(e) CREATE (s)-[:AuthorFeedNext{author_id:"+@author_id.to_s+"}]->(e) DELETE f1, f2  WITH author, "+object
	end

	def create object
		" MATCH (author)-[old:AuthorFeedNext]->(old_feed) OPTIONAL MATCH (" + object + ")-[existing_relation:AuthorFeedNext{author_id:" + @author_id.to_s + "}]->() FOREACH(ignore IN CASE WHEN existing_relation IS NULL THEN [1] ELSE [] END | MERGE (author)-[:AuthorFeedNext{author_id:" + @author_id.to_s + "}]->(" + object + ") MERGE (" + object + ")-[:AuthorFeedNext{author_id:" + @author_id.to_s + "}]->(old_feed) DELETE old SET author.latest_feed_id = ID(" + object + ")) WITH author, " + object + " "
	end
end
