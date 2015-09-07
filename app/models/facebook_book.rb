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
		type_string = FacebookBook.get_type(book["type"])
		" MERGE (book :FacebookBook{facebook_id: " + book["id"].to_s + "}) ON CREATE SET"\
		" book.title =  \"" + book["title"].to_s + "\", "\
		" book.url = \"" + book["url"].to_s + "\" , "\
		" book.type = \"" + type_string + "\" "\
		" WITH book "\
		"" + Book::BookFeed.create_self_feed + " "\
		" WITH book "
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
			clause += " MERGE (node)<-[:" + relation["type"] + "]-(book)  "
		else
			clause += " MERGE (node)-[:" + relation["type"] + "]->(book) "
		end
		clause + " SET node.book_id = CASE WHEN node.book_id IS NOT NULL THEN ID(book) ELSE node.book_id END WITH book "
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

		title = params["name"].strip
		title_search_index = title.search_ready
		clause = 
		" SET facebook_book.facebook_book_title = \'" + title + "\' " +
		" SET facebook_book.facebook_id = " + facebook_id.to_s + 
		" SET facebook_book.facebook_likes = " + facebook_likes.to_s + 
		" SET facebook_book.facebook_description = \"" + facebook_description.to_s.database_ready + "\"" +
		" SET facebook_book.facebook_talking_about_count = " + facebook_talking_about_count.to_s + 
		" SET facebook_book.facebook_likes_count = " + facebook_likes_count.to_s  + 
		" SET facebook_book.facebook_url = \"" + params["link"].to_s + "\"" + 
		" SET facebook_book.author_name = \'" + author + "\' " +
		" " + FacebookBook.set_book_property + " " +
		" WITH facebook_book " +
		" " + Author.merge_by_index(author_search_index) + ", facebook_book " +
		" " + Book.merge_author('facebook_book') + " "
	end

	def self.set_book_property
		FacebookBook.set_property("url", "facebook_book.url", "facebook_book.facebook_url") +
		FacebookBook.set_property("description", "facebook_book.description", "facebook_book.facebook_description") +
		FacebookBook.set_property("title", "facebook_book.title", "facebook_book.facebook_book_title") + " "
	end

	def self.set_book_label
		" SET facebook_book:Book "
	end

	private
	def self.set_property( property ,first_preference, second_prefernce)
		" SET facebook_book." + property + " = CASE WHEN " + first_preference + " IS NULL THEN " + second_prefernce + " ELSE " + first_preference + " END "
	end

	def self.get_type booktype
		type_string = booktype.gsub("books.","").split(":")
		output = type_string[type_string.length - 1]
		output
	end
end