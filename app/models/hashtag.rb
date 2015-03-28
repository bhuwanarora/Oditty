class Hashtag < Neo
	def initialize hash_tag, user_id
		@user_id = user_id
		@hash_tag = hash_tag
	end

	def create
		" (status)-[:HashTagged{user_id:" + @user_id.to_s + "}]->(hash_tag:HashTag{hash_tag:\"" + @hash_tag + "\"}) "
	end
end