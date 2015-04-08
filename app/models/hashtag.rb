class Hashtag < Neo
	def initialize hashtag, user_id
		@user_id = user_id
		@hashtag = hashtag
	end

	def create
		" MERGE(hashtag:Hashtag{hashtag:\"" + @hashtag.to_s + "\" }) CREATE UNIQUE (status)-[tagged:Hashtagged{user_id:" + @user_id.to_s + "}]->(hashtag) WITH status "
	end

	def self.create_group(hashtags, user_id)
		clause = ""
		unless hashtags.nil?
			for hashtag in hashtags do 
				clause = clause + Hashtag.new(hashtag, user_id).create
			end
		end
		clause
	end

end