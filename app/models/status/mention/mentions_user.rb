class Status::Mention::MentionsUser < Status::Mention
	def initialize mentioned_user_id, user_id
		@mentioned_user = User.new(mentioned_user_id)
		@user_id = user_id
		@node_variable = "mentioned_user"
	end

	def create 
		@mentioned_user.match("user") + ", status " + Status::Mention.new(@user_id).create("user")
	end

	def self.create_group mentioned_users_id, user_id
		User.match_group(mentioned_users_id) + Status::Mention::MentionsUser.create_for_user(user_id)
	end

	def self.create_for_user user_id
		" CREATE UNIQUE (status)-[mentions:Mentions{user_id: "+user_id.to_s+"}]->(user) WITH user, status "
	end
end