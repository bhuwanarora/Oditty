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

	def match_books
		" MATCH (author)-[:Wrote]->(book:Book) WITH author, COLLECT({"+Book.grouped_basic_info+"}) AS book "
	end

	def self.match_books
		" MATCH (author:Author)-[:Wrote]->(book:Book) WITH author, book "
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
		" author.name AS name, ID(author) AS id, author.wiki_url AS wiki_url, author.overview as overview "
	end

	def self.get_favourites skip_count=0
		skip(skip_count) +  limit(Constant::Count::FollowFavoriteAuthors) + return_init + Author.basic_info
	end

	def get_details
		match + match_books + Author.return_group(Author.basic_info, "book AS books") + Author.limit(10)
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