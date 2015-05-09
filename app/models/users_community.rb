class UsersCommunity < Neo

	def initialize user_id, community_id
		@user_id = user_id.to_s
		@community_id = community_id.to_s
		@user = User.new(user_id)
		@community = Community.new(community_id)
	end

	def create
		" MERGE (user)-[follows:Follows]->(follow_node:FollowNode{created_at:" + Time.now.to_i.to_s + ", updated_at:" + Time.now.to_i.to_s + ", user_id:" + @user_id.to_s + ", community_id: " + @community_id.to_s + "})-[:OfCommunity]->(community) WITH user, follow_node, community, follows "
	end

	def remove
		" MATCH (user)-[follows:Follows]->(follow_node:FollowNode)-[of_community:OfCommunity]->(community) DELETE follows, of_community WITH user, follow_node, community MATCH (n1)-[r1:FeedNext]->(follow_node)-[r2:FeedNext]->(n2) OPTIONAL MATCH (follow_node)-[r]-() DELETE r DELETE r1, r2, r CREATE UNIQUE (n1)-[:FeedNext]->(n2) WITH follow_node  "
	end

	def follow
		match + Community.set_follow_count + create + User::Feed.new(@user_id).create("follow_node") + UsersCommunity.return_group(Community.basic_info)
	end

	def unfollow
		operation = "-"
		match + Community.set_follow_count(operation) + " WITH user, community " + remove + " , user" + User::Feed.new(@user_id).delete_feed("follow_node") + " DELETE follow_node "
	end

	def set_view_count
		" SET community.view_count = COALESCE(community.view_count,0) + 1 "
	end

	def self.delete
		UsersCommunity.optional_match + " OPTIONAL MATCH (follow_node)-[relation]-() DELETE relation "
	end

	# def comment
	# 	@user.match(user_id) + @community.match + ", user " + match + merge_comment + User::Feed.new(@user_id).create("follow_node") + Community::Feed.create("follow_node") + User::Feed.create("follow_node")  
	# end

	def self.optional_match
		" OPTIONAL MATCH (user)-[follows:Follows]->(follow_node:FollowNode)-[of_community:OfCommunity]->(community) WITH user, follows, follow_node, of_community, community  "
	end

	def self.basic_info
		" ID(follow_node) AS follow_node "
	end

	def get_info
		@community.match + Community.match_news  + " WITH community, " +  UsersCommunity.collect_map("news" => News.grouped_basic_info) + @user.match + ", community, news " + UsersCommunity.optional_match  + ", news " + Community.return_group(UsersCommunity.basic_info, "news ")
	end

	def match
		" MATCH (user:User), (community:Community) WHERE ID(user)= #{@user_id}  AND ID(community)=#{ @community_id} WITH user, community "
	end
end