class User::UserNotification < User
	def initialize(user_id, node)
		@user_id = user_id
		@user = User.new(@user_id)
		@node = node
	end

	def create
		@user.match + User::UserNotification.match + " CREATE UNIQUE (user)-[:NextNotification{user_id:"+@user_id.to_s+"}]-("+@node+")-[:NextNotification{user_id:"+@user_id.to_s+"}]->(notification) " + User::UserNotification.delete_next_notification + " WITH user "
	end

	def self.add node_variable
		User::UserNotification.match  + ", " + node_variable + " OPTIONAL MATCH (" + node_variable + ")-[existing_relation:NextNotification{user_id:ID(user)}]->() FOREACH(IgnoreMe IN CASE WHEN existing_relation IS NULL THEN [1] ELSE [] END | CREATE UNIQUE (user)-[:NextNotification{user_id:ID(user)}]->("+ node_variable +")-[:NextNotification{user_id:ID(user)}]->(notification) " + User::UserNotification.delete_next_notification + " ) WITH user, " + node_variable + " "
	end

	def self.remove node_variable
		" MATCH (s)-[f1:NextNotification]->("+node_variable+")-[f2:NextNotification]->(e) CREATE (s)-[:NextNotification]->(e) DELETE f1, f2  WITH "+node_variable
	end

	def self.match
		" MATCH (user)-[next_notification:NextNotification]->(notification) WITH user, notification, next_notification "
	end

	def self.delete_visited_notification
		" DELETE visited_notification "
	end

	def self.delete_next_notification
		" DELETE next_notification "
	end

	def self.match_path
		" MATCH path = (user)-[:NextNotification*{user_id:ID(user)}]->(notification) WITH path "
	end

	def self.match_last_visited_notification(user_id)
		User.new(user_id).match + " MATCH (user)-[visited_notification:VisitedNotification]->(notification) WITH notification, user, visited_notification "
	end

	def self.create_for_new_user
		" CREATE UNIQUE (user)-[:NextNotification{user_id:ID(user)}]->(user) CREATE UNIQUE (user)-[:VisitedNotification]->(user) WITH user "
	end

	def self.create_visited_notification
		" MATCH (user)-[:NextNotification]->(new_visited_notification) CREATE UNIQUE (user)-[:VisitedNotification]->(new_visited_notification) WITH user "
	end

	def self.basic_info
		" DISTINCT(notification) AS notification, LABELS(notification) AS label, notification.created_at AS created_at "
	end
end