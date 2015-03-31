class Author < Neo

	def initialize author_id
		@id = author_id
	end

	def match node_variable="author"
		" MATCH ("+node_variable+": Author) WHERE ID("+node_variable+")="+@id.to_s+" WITH "+node_variable+" "
	end

	def books
		" MATCH (author)-[:Wrote]->(book:Book) WITH book, author "
	end

	def self.remove
	end

	def self.is_duplicate
	end

	def match_active
		" MATCH (author:Author :ActiveAuthor) WITH author "
	end

	def match node_variable="author"
		" MATCH (" + node_variable + ":Author) WHERE ID(" + node_variable + ") = " + @id.to_s + " WITH " + node_variable + " "
	end

	def order_desc
		" ORDER BY author.priority DESC "
	end

	def self.basic_info
		" author.name AS name, author.id AS id, author.wiki_url AS wiki_url, author.overview as overview "
	end

	def self.get_favourites skip_count=0
		skip(skip_count) +  limit(Constants::FollowFavoriteAuthorsCount) + return_init + Author.basic_info
	end

	def self.match_path name, book, label_defined=false
		if label_defined
			author_node =  name 
		else
			author_node = name.downcase + ":" + name.camelcase
		end
		" OPTIONAL MATCH (" + author_node + ")" + "-[:Wrote]->(" + book + ")"
	end

	def get_details
		match + books + Author.return_group(Author.basic_info, Book.detailed_info) + Author.limit(10)
	end

end