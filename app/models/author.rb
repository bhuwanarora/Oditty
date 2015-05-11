class Author < Neo

	def initialize author_id
		@id = author_id
	end

	def match
		" MATCH (author: Author) WHERE ID(author)="+@id.to_s+" WITH author "
	end

	def self.match_group ids
		clause = ""
		unless ids.nil?
			for id in ids do 
				if clause.present?
					clause = clause + " OR "
				else
					clause = " WHERE "
				end
				clause = clause + " ID(author) = " + id.to_s
			end
		end
		clause = " MATCH (author:Author) " + clause
		clause
	end

	def optional_match_books
		" OPTIONAL MATCH (author)-[:Wrote]->(book:Book) WITH author, book "
	end

	def self.match_books
		" MATCH (author:Author)-[:Wrote]->(book:Book) WITH author, book "
	end

	def get_books user_id, skip_count = 0
		if user_id
			clause = match + optional_match_books + Author.order_by("book.published_year DESC") + User.new(user_id).match + ", author, book " + Bookmark::Type::IOwnThis.match(user_id) + ", author " + Author.return_group("COLLECT({"+Book.grouped_basic_info+", description: book.description, own_status:ID(bookmark_node)}) AS books")
		else
			clause = match + optional_match_books + Author.order_by("book.published_year DESC") + Author.skip(skip_count) + Author.limit(4) + Author.return_group("COLLECT({"+Book.grouped_basic_info+", description: book.description}) AS books ")
		end
		clause
	end

	def self.match_author_for_books
		" MATCH (author:Author)-[:Wrote]->(book) WITH author, COLLECT(book) AS book "
	end

	def self.remove
	end

	def self.is_duplicate
	end

	def match_active
		" MATCH (author:Author :ActiveAuthor) WITH author "
	end

	def order_desc
		" ORDER BY author.priority DESC "
	end

	def self.basic_info
		" author.name AS name, ID(author) AS id, author.wiki_url AS wiki_url, author.overview as overview, labels(author) AS label "
	end

	def self.get_favourites skip_count=0
		skip(skip_count) +  limit(Constant::Count::FollowFavoriteAuthors) + return_init + Author.basic_info
	end

	def get_details user_id
		if user_id.present?
			clause = match + optional_match_books + Author.order_by("book.published_year DESC") + User.new(user_id).match + ", author, book " + Bookmark::Type::IOwnThis.match(user_id) + ", author " + Author.return_group(Author.basic_info, "COLLECT({"+Book.grouped_basic_info+", description: book.description, own_status:ID(bookmark_node)}) AS books")
		else
			clause = match + optional_match_books + Author.order_by("book.published_year DESC") + Author.return_group(Author.basic_info, "COLLECT({"+Book.grouped_basic_info+", description: book.description}) AS books ")
		end
		clause
	end

	def self.search_by_indexed_name indexed_name
		"START author=node:node_auto_index('indexed_main_author_name:\"" + indexed_name + "\"') WITH author " 
	end

	def self.get_by_indexed_name indexed_name
		Author.search_by_indexed_name(indexed_name) + Author.return_init + Author.basic_info 
	end

	def self.match_active
		" MATCH (author:Author :Active) WITH author "
	end

	def self.get_active_authors skip_count 
		Author.match_active + Author.order_by("author.priority DESC ") + Author.skip(skip_count) + Author.limit(Constant::Count::FollowFavoriteAuthors) + Author.return_group(Author.basic_info)
	end
end