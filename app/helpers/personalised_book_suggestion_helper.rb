module PersonalisedBookSuggestionHelper

	def self.execute_query clause
		@neo ||= Neography::Rest.new
		data = @neo.execute_query clause
		data
	end

	def self.get_tiny_reads
		get_top_ten_tiny_reads_clause = " MATCH path = (book)-[:NextTinyRead*9]->(tiny_reads) WHERE ID(book) = " + Constants::BestTinyRead.to_s + " WITH EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book RETURN "
		get_book_property_clause = self.get_return_book_properties_clause 
		clause = get_top_ten_tiny_reads + get_book_property_clause
		data = self.execute_query clause
		data
	end

	def self.get_books_from_likeable_category(user_id, in_descending = false)
		match_user_to_category_clause = " MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true}) "
		get_mean_deviation_clause = "WITH TOFLOAT(SUM(likes_category.likeability_index)*1.0/COUNT(root_category)) AS mean_likeability_index, user MATCH (user)-[likes_category:Likes]->(root_category:Category{is_root:true}) WITH likes_category, root_category, mean_likeability_index RETURN root_category.name as category_name, TOFLOAT(likes_category.likeability_index*1.0 - mean_likeability_index) AS mean_deviation ORDER BY mean_deviation "
		
		clause = self.match_user(user_id) + match_user_to_category_clause + get_mean_deviation_clause
		unless in_descending
			clause += " DESC"
		end
		data = self.execute_query clause
		data
	end

	def self.get_books_from_most_read_author user_id
		get_max_read_author_clause = " MATCH (user)-->(:BookmarkNode)-->(book:Book)<-[:Wrote]-(author:Author) WITH author, COUNT(book) AS books RETURN author.name AS author_name, ID(author) AS author_id , books AS books_count ORDER BY books DESC"
		clause = self.match_user(user_id) + get_max_read_author_clause
		data = self.execute_query clause
		data
	end

	def self.get_books_from_most_read_era user_id
		get_max_read_era_clause = " MATCH (user)-->(:BookmarkNode)-->(book:Book)-[:Published_in]-()-[:FromEra]->(era:Era) WITH era, COUNT(book) AS books_from_era RETURN era.name AS era_name, ID(era) AS era_id, era.range AS era_range, books_from_era AS books_from_era_count ORDER BY books_from_era DESC"
		clause = self.match_user(user_id) + get_max_read_era_clause
		data = self.execute_query clause
		data
	end

	def self.books_on_your_friends_shelves user_id
		get_friends_reads_clause = " OPTIONAL MATCH (user)-[:Follows]->(friend)-->(:Label{name:'CurrentlyReading'})-->(:BookmarkNode)--(book:Book) WITH COUNT(book) AS book_count, book RETURN book, book_count ORDER BY book_count DESC"
		clause = self.match_user(user_id) + get_friends_reads_clause
		data = self.execute_query clause
		data
	end

	private

	def self.get_return_book_properties_clause 
		clause = " ID(book) AS id, book.isbn AS isbn, book.title AS title, book.author_name AS author_name, book.pages_count AS pages_count, book.published_year AS published_year, book.total_weight as popularity"
		clause
	end

	def self.match_user user_id
		clause = " MATCH (user:User) WHERE ID(user) = " + user_id.to_s + " WITH user"
		clause
	end
end