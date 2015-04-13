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
		" MATCH (author)-[:Wrote]->(book:Book) WITH book, author "
	end

	def self.match_books
		" MATCH (author:Author)-[:Wrote]->(book:Book) WITH book, author "
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
		" author.name AS name, author.id AS id, author.wiki_url AS wiki_url, author.overview as overview "
	end

	def self.get_favourites skip_count=0
		skip(skip_count) +  limit(Constant::Count::FollowFavoriteAuthors) + return_init + Author.basic_info
	end

	def get_details
		match + match_books + Author.return_group(Author.basic_info, Book.detailed_info) + Author.limit(10)
	end

end