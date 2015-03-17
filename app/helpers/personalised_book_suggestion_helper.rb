module PersonalisedBookSuggestionHelper

	def self.get_top_ten_tiny_reads
		get_top_ten_tiny_reads_clause = " MATCH path = (book)-[:NextTinyRead*9]->(tiny_reads) WHERE ID(book) = " + Constants::BestTinyRead.to_s + " RETURN EXTRACT (n IN nodes(path)|n) AS tiny_books "
		clause = _match_user + get_top_ten_tiny_reads
	end


	def self.get_category_by_likeability in_descending = false
		clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true}) WITH TOFLOAT(SUM(likes_category.likeability_index)*1.0/COUNT(root_category)) AS mean_likeability_index, user MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true}) WITH likes_category, root_category, mean_likeability_index RETURN root_category, TOFLOAT(likes_category.likeability_index*1.0 - mean_likeability_index) AS mean_deviation ORDER BY mean_deviation "
		unless in_descending
			clause += " DESC"
		end
		clause = _match_user + clause
	end

	def self.get_most_read_author
		get_max_read_author_clause = " MATCH (user)-->(:BookmarkNode)-->(book:Book)<-[:Wrote]-(author:Author) WITH author, COUNT(book) AS books RETURN author AS author ORDER BY books DESC"
		clause = _match_user + get_max_read_author_clause
	end

	def self.get_most_read_era
		get_max_read_author_clause = " MATCH (user)-->(:BookmarkNode)-->(book:Book)-[:Published_in]-()-[:FromEra]->(era:Era) WITH era, COUNT(book) AS books_from_era RETURN era ORDER BY books_from_era DESC"
		clause = _match_user + get_max_read_era_clause
	end

	def self.books_on_your_friends_shelves
		get_friends_reads_clause = "(User)-[:Follows]->(friend)-->(:Label{name:CurrentlyReading})-->(:BookmarkNode)--(book:Book) WITH COUNT(book) AS book_count, book RETURN book, book_count ORDER BY book_count DESC"
		clause = _match_user + get_friends_reads_clause
	end
end