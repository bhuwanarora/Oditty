class UsersCommunity < Neo

	def initialize user_id, community_id
		@user_id = user_id
		@community_id = community_id
		@user = User.new(user_id)
		@community = community.new(community_id)
	end

	def create
		" MERGE (user)-[follows:Follows]->(follow_node:FollowNode{created_at:" + Time.now.to_i.to_s + ", updated_at:" + Time.now.to_i.to_s + ", user_id:" + @user_id.to_s + ", community_id: " + @community_id.to_s + "})-[:OfCommunity]->(community)  "
	end

	def follow
		@user.match + @community.match + ", user " + create + Community.set_follow_count + Community::Feed.create("follow_node") + User::Feed.create("follow_node")
	end

	def set_view_count
		" SET community.view_count = COALESCE(community.view_count,0) + 1 "
	end

	# def comment
	# 	@user.match(user_id) + @community.match + ", user " + match + merge_comment + User::Feed.new(@user_id).create("follow_node") + Community::Feed.create("follow_node") + User::Feed.create("follow_node")  
	# end

	def match
		" MATCH (user)-[follows:Follows]->(follow_node:FollowNode)-[of_community:OfCommunity]->(community) WITH user, follows, follow_node, of_community, community  "
	end
end