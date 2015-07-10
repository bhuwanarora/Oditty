class UsersCommunity < Neo

	def initialize user_id, community_id
		@user_id = user_id.to_s
		@community_id = community_id.to_s
		@user = User.new(user_id)
		@community = Community.new(community_id)
	end

	def create
		" MERGE (user)-[follows:Follows]->(follow_node:FollowsNode{user_id:" + @user_id.to_s + ", community_id: " + @community_id.to_s + "}) MERGE (follow_node)-[:OfCommunity]->(community) ON CREATE SET follow_node.created_at = " + Time.now.to_i.to_s + ", follow_node.updated_at = " + Time.now.to_i.to_s + " ON MATCH SET follow_node.updated_at = " + Time.now.to_i.to_s + " WITH user, follow_node, community, follows "
	end

	def remove
		" MATCH (user)-[follows:Follows]->(follow_node:FollowsNode)-[of_community:OfCommunity]->(community) DELETE follows, of_community WITH user, follow_node, community MATCH (n1)-[r1:FeedNext]->(follow_node)-[r2:FeedNext]->(n2) OPTIONAL MATCH (follow_node)-[r]-() DELETE r CREATE UNIQUE (n1)-[:FeedNext]->(n2) WITH follow_node  "
	end

	def self.where_not
		" WHERE NOT (user)-[:Follows]->(:FollowsNode)-[:OfCommunity]->(community) "
	end

	def follow
		match + Community.set_follow_count + create + User::Feed.new(@user_id).create("follow_node") + ", community " + UsersCommunity.return_group(Community.basic_info)
	end

	def unfollow
		operation = "-"
		match + Community.set_follow_count(operation) + " WITH user, community " + remove + " , user, community DELETE follow_node WITH DISTINCT community " + UsersCommunity.return_group(Community.basic_info)
	end

	def self.set_view_count
		" SET community.view_count = COALESCE(community.view_count,0) + 1 "
	end

	def self.delete
		UsersCommunity.optional_match + " OPTIONAL MATCH (follow_node)-[relation]-() DELETE relation "
	end

	# def comment
	# 	@user.match(user_id) + @community.match + ", user " + match + merge_comment + User::Feed.new(@user_id).create("follow_node") + Community::Feed.create("follow_node") + User::Feed.create("follow_node")  
	# end

	def self.optional_match
		" OPTIONAL MATCH (user)-[follows:Follows]->(follow_node:FollowsNode)-[of_community:OfCommunity]->(community) WITH user, follows, follow_node, of_community, community  "
	end

	def self.match community = "community"
		" MATCH (user)-[follows:Follows]->(follow_node:FollowsNode)-[of_community:OfCommunity]->(" + community + ") WITH user, follows, follow_node, of_community, " + community + " "
	end

	def self.basic_info
		" ID(follow_node) AS follow_node "
	end

	def get_info
		clause = ""
		if(@user_id == "")
			clause = @community.match + Community.match_news  + " WITH community, " +  UsersCommunity.collect_map("news" => News.grouped_basic_info) + UsersCommunity.set_view_count + Community.return_group("news", Community.basic_info)
		else
			clause = @community.match + Community.match_news  + " WITH community, " +  UsersCommunity.collect_map("news" => News.grouped_basic_info) + @user.match + ", community, news " + UsersCommunity.optional_match  + ", news "  + UsersCommunity.set_view_count + Community.return_group(UsersCommunity.basic_info, "news", Community.basic_info)
		end
		clause
	end

	def match
		" MATCH (user:User), (community:Community) WHERE ID(user)= #{@user_id}  AND ID(community)=#{ @community_id} WITH user, community "
	end

	def self.top_communities user_id, skip_count=0
		User.new(user_id).match + " MATCH (community:Community) WITH user, community " + UsersCommunity.where_not + Community.return_init + Community.basic_info + Community.order_by("community.follow_count, community.view_count DESC ") + Community.skip(skip_count) + Community.limit(Constant::Count::CommunitiesSuggested) 
	end
end