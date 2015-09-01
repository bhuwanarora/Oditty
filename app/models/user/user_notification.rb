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
		User::UserNotification.match  + ", " + node_variable + " CREATE UNIQUE (user)-[:NextNotification{user_id:ID(user)}]->("+ node_variable +")-[:NextNotification{user_id:ID(user)}]->(notification) " + User::UserNotification.delete_next_notification + User::UserNotification.increment_notification_count + " WITH user, " + node_variable + " "
	end

	def self.remove node_variable
		" MATCH (s)-[f1:NextNotification]->(" + node_variable + ")-[f2:NextNotification]->(e)"\
		" OPTIONAL MATCH (user_concerned:User)-[visited_notification:VisitedNotification]->(" + node_variable + ")"\
		" FOREACH (ignore IN (CASE WHEN visited_notification IS NULL THEN [] ELSE [1] END) | "\
			" CREATE (user_concerned)-[:VisitedNotification{user_id: visited_notification.user_id}]->(e) "\
		" ) "\
		" CREATE (s)-[:NextNotification{user_id:f1.user_id}]->(e) "\
		" DELETE f1, f2  WITH " + node_variable + " "
	end

	def self.match label="notification"
		" MATCH (user)-[next_notification:NextNotification{user_id:ID(user)}]->(" + label + ") WITH user, " + label + ", next_notification "
	end

	def self.delete_visited_notification
		" DELETE visited_notification "
	end

	def self.delete_next_notification
		" DELETE next_notification "
	end

	def self.increment_notification_count
		" SET user.notification_count = COALESCE(user.notification_count, 0) + 1 "
	end

	def self.reset_notification_count
		" SET user.notification_count = 0 "
	end

	def self.match_path
		" MATCH path = (user)-[:NextNotification*{user_id:ID(user)}]->(notification) WITH path "
	end

	def match_last_visited_notification
		@user.match + " MATCH (user)-[visited_notification:VisitedNotification]->(notification) WITH notification, user, visited_notification "
	end

	def self.create_for_new_user
		" MERGE (user)-[:NextNotification{user_id:ID(user)}]->(user) MERGE (user)-[:VisitedNotification]->(user) WITH user "
	end

	def self.create_visited_notification
		User::UserNotification.match("new_visited_notification") + ", notification CREATE UNIQUE (user)-[:VisitedNotification{user_id:ID(user)}]->(new_visited_notification) WITH user "
	end

	def self.basic_info
		" notification, LABELS(notification) AS label, notification.created_at AS created_at "
	end
end