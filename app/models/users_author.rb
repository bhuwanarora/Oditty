class UsersAuthor < Neo
	def initialize author_id, user_id
		@author_id = author_id
		@user_id = user_id
	end

	def self.merged_viewed
		" MERGE (user)-[:Viewed{created_at:" + Time.now.to_i.to_s + "}]->(author) WITH user, author "
	end

	def match
		" MATCH (user:User), (author:Author) WHERE ID(user) = " + @user_id.to_s + " AND ID(author) = " + @author_id.to_s + " WITH author, user "
	end

	def create
		" MERGE (user)-[follows:Follows]->(follows_node:FollowsNode{user_id:" + @user_id.to_s + ", author_id: " + @author_id.to_s + "}) MERGE (follows_node)-[:OfAuthor]->(author) ON CREATE SET follows_node.created_at = " + Time.now.to_i.to_s + ", follows_node.updated_at = " + Time.now.to_i.to_s + " ON MATCH SET follows_node.updated_at = " + Time.now.to_i.to_s + "  WITH user, follows_node, author, follows "
	end

	def remove
		" MATCH (user)-[follows:Follows]->(follows_node:FollowsNode)-[of_author:OfAuthor]->(author) DELETE follows, of_author WITH user, follows_node, author OPTIONAL MATCH (n1)-[r1:FeedNext]->(follows_node)-[r2:FeedNext]->(n2) OPTIONAL MATCH (follows_node)-[r]-() OPTIONAL MATCH (n3)-[r3:AuthorFeedNext]->(follows_node)-[r4:AuthorFeedNext]->(n4)  CREATE UNIQUE (n1)-[:FeedNext]->(n2)   CREATE UNIQUE (n3)-[:AuthorFeedNext]->(n4)  DELETE r WITH follows_node "
	end

	def follow 
		match + Author.set_follow_count + create + User::Feed.new(@user_id).create("follows_node") + ", author " + Author::Feed.new(@author_id).create("follows_node") +  UsersAuthor.return_group(Author.basic_info)
	end

	def unfollow
		operation = "-"
		match + Author.set_follow_count(operation) + " WITH user, author " + remove + " , user, author DELETE follows_node " + UsersAuthor.return_group(Author.basic_info)
	end
end