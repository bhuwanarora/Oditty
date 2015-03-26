class Node
	def initialize user_id
		@user_id = user_id
	end

	def get_root
		" START root_node = node:node_auto_index( user_id ='" + @user_id.to_s +"') MATCH (root_node)-[:NextFeed{user_id:" + @user_id.to_s + "}]->(latest_feed:FeedNext) WITH root_node, latest_feed "
	end

	def get_node
		" START new = node:node_auto_index( user_id ='" + @user_id.to_s +"') WITH new "
	end

	def set_priority priority
		" SET new.priority = " + priority.to_s + " WITH new "
	end

	def get_left_child 
		" MATCH (latest_feed)-[:LeftChild{user_id:" + @user_id.to_s + "}]-(left_child) WITH left_child "
	end

	def get_right_child
		" MATCH (latest_feed)-[:RightChild{user_id:" + @user_id.to_s + "}]-(right_child) WITH right_child "
	end

	def self.is_leaf
		" MATCH (leaf)-[:RightChild|LeftChild{user_id:" + @user_id.to_s + "}]->(child) WITH COUNT(child) "
	end

	def self.is_root
	end

	def get_leaf
		" MATCH (latest_feed)-[to_leaf:ToLeaf{user_id:" + @user_id.to_s + "}]->(leaf) WITH root_node, leaf, latest_feed ORDER BY to_leaf.length LIMIT 1 "
	end

	def link_leaf
		" MATCH (leaf)-[right_relation:RightChild{user_id:" + @user_id.to_s + "}]->(right_child), (root_node)-[to_leaf:ToLeaf{user_id:" + @user_id.to_s + "}]->(leaf) FOREACH (ignore IN CASE right_relation IS NOT NULL THEN [1] ELSE [] END | MERGE (leaf)-[:LeftChild{user_id:" + @user_id.to_s + "}->(new) ,(root_node)-[new_to_left_leaf:ToLeaf{user_id:" + @user_id.to_s + ",length: COALESCE(to_leaf.length,0) + 1}]->(new), (root_node)-[new_to_right_leaf:ToLeaf{user_id:" + @user_id.to_s + ",length: COALESCE(to_leaf.length,0) + 1}]->(right_child) DELETE to_leaf) FOREACH (ignore IN CASE right_relation IS NULL THEN [1] ELSE [] END | MERGE (leaf)-[:RightChild{user_id:" + @user_id.to_s + "}]->(new)) WITH leaf, new MATCH  WITH new, root_node, latest_feed, leaf "
	end

	def set_position
		" MATCH path = SHORTESTPATH((latest_feed)-[:RightChild|LeftChild*{user_id:" + @user_id.to_s + "}]->(leaf)) WITH new, EXTRACT (filtered IN FILTER( node IN nodes(path):node.priority < new.priority)) AS feeds UNWIND feeds AS feed ORDER BY feed.rank MATCH " + self.match_relationships("feed") + " , " + self.match_relationships("new") + " FOREACH (ignore IN CASE WHEN feed_right_parent IS NOT NULL THEN [1] ELSE [] END | MERGE (feed_right_parent_node)-[:RightChild{user_id: " + @user_id.to_s + "}]->(new), (new)[:RightChild{user_id: " + @user_id.to_s + "}]->(feed) DELETE feed_right_parent )  FOREACH (ignore IN CASE WHEN feed_right_parent IS NULL THEN [1] ELSE [] END | MERGE (feed_left_parent_node)-[:LeftChild{user_id: " + @user_id.to_s + "}]->(new), (new)[:LeftChild{user_id: " + @user_id.to_s + "}]->(feed) DELETE feed_left_parent ) FOREACH (ignore IN CASE WHEN feed_right_parent IS NULL THEN [1] ELSE [] END | MERGE (feed_left_parent_node)-[:LeftChild{user_id: " + @user_id.to_s + "}]->(new), (new)[:LeftChild{user_id: " + @user_id.to_s + "}]->(feed) DELETE feed_left_parent ) FOREACH (ignore IN CASE WHEN (feed_right_child IS NOT NULL AND feed_right_child_node <> new ) THEN [1] ELSE [] END | MERGE (new)-[:RightChild{user_id: " + @user_id.to_s + "}]->(feed_right_child_node) DELETE feed_right_child )  FOREACH (ignore IN CASE WHEN (feed_left_child IS NOT NULL AND feed_left_child_node <> new ) THEN [1] ELSE [] END | MERGE (new)-[:LeftChild{user_id: " + @user_id.to_s + "}]->(feed_left_child_node) DELETE feed_left_child) FOREACH (ignore IN CASE WHEN new_left_child IS NOT NULL THEN [1] ELSE [] END | MERGE (feed)-[:LeftChild{user_id: " + @user_id.to_s + "}]->(new_left_child_node) DELETE new_left_child) FOREACH (ignore IN CASE WHEN new_right_child IS NOT NULL THEN [1] ELSE [] END | MERGE (feed)-[:RightChild{user_id: " + @user_id.to_s + "}]->(new_right_child_node) DELETE new_right_child) " 
	end

	def self.get_conditional_merging relation_existing_node, relation_new_node, new_node="new", existing_node="feed"
		"   " 
	end

	def self.match_relationships node_variable
		" (" + node_variable + ")-[" + node_variable + "_right_child:RightChild{user_id:" + @user_id + "}]->(" + node_variable + "_right_child_node),(" + node_variable + ")-[" + node_variable + "_left_child:LeftChild{user_id:" + @user_id + "}]->(" + node_variable + "_left_child_node), (" + node_variable + ")<-[" + node_variable + "_right_parent:RightChild{user_id:" + @user_id + "}]-(" + node_variable + "_right_parent_node) "
	end
end
