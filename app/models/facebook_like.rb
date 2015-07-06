class FacebookLike < Neo
	def initialize app_id
		@app_id = app_id
	end

	def match
		" MATCH (facebook_like:FacebookLike) WHERE facebook_like.app_id = " + @app_id + " WITH facebook_like "
	end

	def merge
		" MERGE (facebook_like:FacebookLike{app_id: " + @app_id + "}) WITH facebook_like "
	end

	def merge_info(category, created_time, name)
		merge + FacebookLike.set_category(category) + FacebookLike.set_name(name) + FacebookLike.set_created_time(created_time)
	end

	def self.get_relationship_type field_name
		"FbRel" + field_name.search_ready.camelize + ""
	end

	def self.get_node_label field_name
		"Fb" + field_name.search_ready.camelize + ""
	end

	def self.set_category category
		clause = " SET facebook_like "
		categories = category.split("/")
		categories.each do |category_single|
			clause += ":"+FacebookLike.get_node_label(category_single)
		end
		clause += " SET facebook_like.category = \"" + category.to_s + "\" "
	end

	def self.set_name name
		" SET facebook_like.set_name = \"" + name.to_s + "\" "
	end

	def self.set_created_time created_time
		" SET facebook_like.created_time = " + created_time.to_s + " "
	end

	def self.basic_info
		" facebook_like.app_id AS app_id, ID(facebook_like) AS id, facebook_like.name AS name "
	end

end