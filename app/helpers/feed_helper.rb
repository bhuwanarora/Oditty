module FeedHelper

	def self.create_user_feed user_id
		clause = "MATCH ()-[r:FeedNext{user_id:"+user_id.to_s+"}]-() DELETE r"
		clause.execute

		clause = " MATCH (a:BookmarkNode) "\
		" WHERE a.user_id="+user_id.to_s+" AND a.label <> 'FromFacebook' AND a.label <> 'Visited' "\
		" RETURN ID(a) AS id, a.created_at AS created_at "\
		" UNION ALL MATCH (a:EndorseNode) "\
		" WHERE  a.user_id ="+user_id.to_s+" "\
		" RETURN ID(a) AS id, a.created_at AS created_at "\
		" UNION ALL MATCH (a:FollowsNode) "\
		" WHERE a.user_id = "+user_id.to_s+
		" RETURN ID(a) AS id, a.created_at AS created_at "\
		" UNION ALL MATCH (a:StatusNode) "\
		" WHERE a.user_id = "+user_id.to_s+" "\
		" RETURN ID(a) AS id, a.created_at AS created_at "
		feed = clause.execute

		feed.sort_by!{|single_feed| single_feed["created_at"]}

		clause = " MATCH (n1), (n2) WHERE ID(n1)="+user_id.to_s+" AND ID(n2)="+feed[0]["id"].to_s+" CREATE UNIQUE (n1)-[:FeedNext{user_id:"+user_id.to_s+"}]->(n2) "
		clause.execute
		for index in 0..(feed.length - 2)
			clause = " MATCH (n1), (n2) WHERE ID(n1)="+feed[index]["id"].to_s+" AND ID(n2)="+feed[index+1]["id"].to_s+" CREATE UNIQUE (n1)-[:FeedNext{user_id:"+user_id.to_s+"}]->(n2) "
			clause.execute
		end
		clause = " MATCH (n1), (n2) WHERE ID(n1)="+feed[feed.length - 1]["id"].to_s+" AND ID(n2)="+user_id.to_s+" CREATE UNIQUE (n1)-[:FeedNext{user_id:"+user_id.to_s+"}]->(n2) "
		clause.execute
	end
end