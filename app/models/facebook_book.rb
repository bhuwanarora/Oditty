class FacebookBook < Neo
	def initialize id
		@id = id
	end

	def self.basic_info
		" book.title AS title, book.facebook_url AS facebook_url, book.facebook_id AS facebook_id "
	end

	def match
		" MATCH (book:FacebookBook) WHERE book.facebook_id =" + @id.to_s + " WITH book "
	end

	def map params
		facebook_id = params["id"]
		facebook_likes = params["likes"] rescue 0
		facebook_description = params["description"] rescue ""
		facebook_talking_about_count = params["talking_about_count"] rescue 0

		author = params["written_by"]
		author_search_index = author.search_ready

		title = params["name"]
		title_search_index = title.search_ready

		match + " WITH book AS facebook_book "\
		"OPTIONAL MATCH (book) "\
		"WHERE book.search_index = "+title_search_index+ " AND book.indexed_author_name = "+author_search_index
		+" SET book.facebook_id = "+facebook_id.to_s
		+" SET book.facebook_likes = "+facebook_likes.to_s
		+" SET book.facebook_description = \""+facebook_description.to_s
		+"\" SET book.facebook_talking_about_count = " + facebook_talking_about_count.to_s
		# ITERATE OVER RELATIONSHIPS AND DELETE THE FACEBOOK_BOOK RELATIONS AND ADD THE SAME TO BOOK
	end
end