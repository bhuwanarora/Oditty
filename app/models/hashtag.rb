class Hashtag
	def match
		
	end

	def self.create(user_id, hash_tag)
		" (status)-[:HashTagged{user_id:" + user_id.to_s + "}]->(hash_tag:HashTag{hash_tag:\"" + hash_tag + "\",timestamp:" + Time.now.to_i.to_s + "}) "
	end
end