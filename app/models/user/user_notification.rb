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
		User::UserNotification.match  + ", " + node_variable + " OPTIONAL MATCH (" + node_variable + ")-[existing_relation:NextNotification{user_id:ID(user)}]->() CREATE UNIQUE (user)-[:NextNotification{user_id:ID(user)}]->("+ node_variable +")-[:NextNotification{user_id:ID(user)}]->(notification) " + User::UserNotification.delete_next_notification + User::UserNotification.increment_notification_count + " WITH user, " + node_variable + " "
	end

	def self.remove node_variable
		" MATCH (s)-[f1:NextNotification]->("+node_variable+")-[f2:NextNotification]->(e) CREATE (s)-[:NextNotification{user_id:f1.user_id}]->(e) DELETE f1, f2  WITH "+node_variable
	end

	def self.match
		" MATCH (user)-[next_notification:NextNotification{user_id:ID(user)}]->(notification) WITH user, notification, next_notification "
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

	def self.match_path
		" MATCH path = (user)-[:NextNotification*{user_id:ID(user)}]->(notification) WITH path "
	end

	def match_last_visited_notification
		User.new(@user_id).match + " MATCH (user)-[visited_notification:VisitedNotification]->(notification) WITH notification, user, visited_notification "
	end

	def self.create_for_new_user
		" CREATE UNIQUE (user)-[:NextNotification{user_id:ID(user)}]->(user) CREATE UNIQUE (user)-[:VisitedNotification]->(user) WITH user "
	end

	def self.create_visited_notification
		User::UserNotification.match + " CREATE UNIQUE (user)-[:VisitedNotification]->(new_visited_notification) WITH user "
	end

	def self.basic_info
		" DISTINCT(notification) AS notification, LABELS(notification) AS label, notification.created_at AS created_at "
	end
end