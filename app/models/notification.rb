class Notification < Neo

	def initialize(user_id, node)
		@user_id = user_id
		@user = User.new(@user_id)
		@node = node
	end

	def create
		@user.match + Notification.match + " CREATE UNIQUE (user)-[:NextNotification{user_id:"+@user_id.to_s+"}]-("+@node+")-[:NextNotification{user_id:"+@user_id.to_s+"}]->(notification) " + Notification.delete_next_notification + " WITH user "
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
		" MATCH path = (user)-[:NextNotification*]->(notification) "
	end

	def self.match_last_visited_notification(user_id)
		User.new(user_id) + " MATCH (user)-[visited_notification:VisitedNotification]->(notification) WITH notification, user, visited_notification "
	end

	def self.create_for_new_user
		" CREATE UNIQUE (user)-[:NextNotification]->(user) CREATE UNIQUE (user)-[:VisitedNotification]->(user) "
	end

	def self.create_visited_notification
		" MATCH (user)-[:NextNotification]->(new_visited_notification) CREATE UNIQUE (user)-[:VisitedNotification]->(new_visited_notification) WITH user "
	end

end