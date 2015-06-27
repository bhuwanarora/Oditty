class FacebookLike < Neo
	def initialize app_id
		@app_id = app_id
	end

	def match
		" MATCH (facebook_like:FacebookLike) WHERE facebook_like.app_id = " + app_id + " WITH facebook_like "
	end

	def merge
		" MERGE (facebook_like:FacebookLike{app_id: " + app_id + "}) WITH facebook_like "
	end

	def merge_info(category, created_time, name)
		merge + FacebookLike.set_category + FacebookLike.set_facebook_created_time + FacebookLike.set_name + FacebookLike.set_created_time
	end

	def self.set_category category
		" SET facebook_like :Fb" + category.to_s.search_ready + " SET facebook_like.category = \"" + category.to_s + "\" "
	end

	def self.set_name name
		" SET facebook_like.set_name = \"" + name.to_s + "\" "
	end

	def self.set_created_time created_time
		" SET facebook_like.created_time = " + Time.now.to_i.to_s + " "
	end

	def self.basic_info
		" facebook_like.app_id AS app_id, ID(facebook_like) AS id, facebook_like.name AS name "
	end

end