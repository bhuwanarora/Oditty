class User::CommunityJoined < User
	def initialize(id)
		@id = id
		@user = User.new(id)
	end

	def get_all
		@user.match + UsersCommunity.match + User::CommunityJoined.return_group(Community.basic_info)
	end
end