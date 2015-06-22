class FacebookBook < Neo
	def initialize id
		@id = id
	end

	def self.basic_info
		" book.title AS title, book.facebook_url AS facebook_url, book.facebook_id AS facebook_id "
	end

	def match
		" MATCH (facebook_book :FacebookBook) WHERE facebook_book.facebook_id = " + @id.to_s + " WITH facebook_book "
	end

	def self.where_not_book
		" WHERE NOT facebook_book :Book "
	end

	def merge book
		" MERGE (book :FacebookBook{facebook_id: " + book["id"].to_s + "}) ON CREATE SET book.title =  \"" + book["title"].to_s + "\", book.url = \"" + book["url"].to_s + "\" ,book.type = \"" + book["type"].to_s.gsub("book.","") + "\" WITH book "
	end

	def self.merge_by_gr_url url
		" MERGE (book:Book {gr_url: \"" + url.to_s + "\"}) WITH book "
	end

	def handle_relations original_book_id, relations
		clause = Book.new(original_book_id).match + " WITH book "
		if relations.present? && relations["outgoing"].present?
			relations["outgoing"].each do |relation|
				clause += relation['node_id'].present? ? FacebookBook.link_relations(relation, original_book_id, outgoing = true) : ""
			end
		end

		if relations.present? && relations["incoming"].present?
			relations["incoming"].each do |relation|
				clause += relation['node_id'].present? ? FacebookBook.link_relations(relation, original_book_id) : ""
			end
		end
		clause + match + ", book " + FacebookBook.where_not_book + "MATCH (facebook_book)-[r]-() DELETE r, facebook_book "  
	end

	def self.link_relations relation, original_book_id, outgoing=false
		clause = " MATCH (node) WHERE ID(node) = " + relation['node_id'].to_s 
		if outgoing
			clause += " MERGE (node)<-[:" + relation["type"] + "]-(book) "
		else
			clause += " MERGE (node)-[:" + relation["type"] + "]->(book) "
		end
		clause + " WITH book "
	end

	def self.get_relations id
		FacebookBook.new(id).match + FacebookBook.where_not_book + " OPTIONAL MATCH (facebook_book)-[out]->(node) WITH facebook_book, COLLECT({ type: TYPE(out), node_id: ID(node)}) AS outgoing OPTIONAL MATCH (facebook_book)<-[in]-(node) WITH COLLECT({ type: TYPE(in), node_id: ID(node)}) AS incoming, outgoing RETURN outgoing, incoming "
	end

	def map params
		facebook_id = params["id"]
		facebook_likes = params["likes"] rescue 0
		facebook_description = params["description"] rescue ""
		facebook_talking_about_count = params["talking_about_count"] rescue 0
		facebook_likes_count = params["likes"] rescue 0

		author = params["written_by"]
		author_search_index = author.search_ready

		title = params["name"]
		title_search_index = title.search_ready
		" SET facebook_book.facebook_id = " + facebook_id.to_s + " SET facebook_book.facebook_likes = " + facebook_likes.to_s + " SET facebook_book.facebook_description = \"" + facebook_description.to_s.database_ready + "\" SET facebook_book.facebook_talking_about_count = " + facebook_talking_about_count.to_s + " SET facebook_book.facebook_likes_count = " + facebook_likes_count.to_s  
	end
end