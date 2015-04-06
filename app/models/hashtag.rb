class Hashtag < Neo
	def initialize hash_tag, user_id
		@user_id = user_id
		@hash_tag = hash_tag
	end

	def create
		" MERGE (hash_tag:HashTag{hash_tag:\"" + @hash_tag + "\"}) MERGE (status)-[tagged:HashTagged{user_id:" + @user_id.to_s + "}]->(hash_tag) "
	end

	def self.create_group hash_tags, user_id  
		clause = ""
		unless hash_tags.nil?
			hash_tags.each{|hash_tag| clause += " WITH status " + Hashtag.new(hash_tag, user_id).create}
		end
		clause
	end
end