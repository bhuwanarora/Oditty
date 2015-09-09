class FacebookLike < Neo
	def initialize app_id, neo_id = nil
		@app_id = app_id
		@neo_id = neo_id
	end

	def match
		" MATCH (facebook_like:FacebookLike) WHERE facebook_like.app_id = " + @app_id.to_s + " WITH facebook_like "
	end

	def match_by_neo_id
		" MATCH (facebook_like:FacebookLike) WHERE ID(facebook_like)=" + @neo_id.to_s + " WITH facebook_like "
	end

	def self.match_books
		" MATCH (facebook_like)-[related_community:RelatedCommunity]->(community:Community)-[relatedbooks:RelatedBooks]->(book:Book) "\
		" WITH facebook_like, community, book, relatedbooks"
	end

	def get_books
		match_by_neo_id + FacebookLike.match_books + " WITH DISTINCT book " + Book.order_by_goodness + FacebookLike.limit(Constant::Count::CommunityBooks.to_s) + Neo.return_init + Book.basic_info
	end

	def self.match_community
		" MATCH (facebook_like:FacebookLike)-[:RelatedCommunity]->(community:Community) "\
		" WITH facebook_like, community "
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
		field_name.search_ready.camelize + ""
	end

	def self.set_category category
		clause = " SET facebook_like "
		categories = category.split("/")
		categories.each do |category_single|
			clause += ":Fb" + FacebookLike.get_node_label(category_single)
		end
		clause += " SET facebook_like.category = \"" + category.to_s + "\" "
	end

	def self.set_name name
		" SET facebook_like.name = \"" + name.to_s + "\" "
	end

	def self.set_created_time created_time
		" SET facebook_like.created_time = " + created_time.to_s + " "
	end

	def self.set_completed node_id
		 FacebookLike.match_by_neo_id(node_id) + " SET facebook_like.completed = true, facebook_like:Community "
	end

	def self.basic_info
		" facebook_like.app_id AS app_id, ID(facebook_like) AS id, facebook_like.name AS name "
	end

	def self.not_completed
		" WHERE NOT HAS(facebook_like.completed) "\
		" WITH user, facebook_like, likes "
	end

	def self.merge_community relevance, node = 'node'
		clause = " MERGE (" + node + ")-[h:RelatedCommunity]->(community)"\
		" ON CREATE SET h +={relevance: "+ relevance['relevance'].to_s+",relevanceOriginal:"+relevance['relevanceOriginal'].to_s+"}"\
		" ON MATCH  SET h +={relevance: "+ relevance['relevance'].to_s+",relevanceOriginal:"+relevance['relevanceOriginal'].to_s+"}"\
		" WITH "+ node + ",community"
		clause
	end

end