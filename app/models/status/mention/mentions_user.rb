class Status::Mention::MentionsUser < Status::Mention
	def initialize mentioned_user_id, user_id
		@mentioned_user = User.new(mentioned_user_id)
		@user_id = user_id
		@node_variable = "mentioned_user"
	end

	def create 
		@mentioned_user.match(@node_variable) + ", status " + Status::Mention.new(@user_id).create(@node_variable)
	end

	def self.handle mentioned_users_ids, user_id
		clause = ""
		unless mentioned_users_ids.nil?
			mentioned_users_ids.each{|mentioned_user_id| clause += Status::Mention::MentionsUser.new(mentioned_user_id, user_id).create}
		end
		clause
	end
end