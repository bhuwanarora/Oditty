class Author < Neo

	def initialize id
		@id = id
	end

	def get_books
		" MATCH (author:Author)-[:Wrote]->(book) WHERE ID(author) = " + @id.to_s
	end

	def match
		" MATCH (author:Author) WHERE ID(author) = " + @id.to_s + " WITH author "
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
		" author.name AS name, author.id AS id "
	end

	def self.get_favourites skip_count=0
		skip(skip_count) +  limit(Constants::FollowFavoriteAuthorsCount) + return_init + Author.basic_info
	end

	def self.get_books book="book", label_defined=false
		unless label_defined
			where_clause = " WHERE author :Author"
		else
			where_clause =  "" 
		end
		" MATCH (" + name + ")" + "-[:Wrote]->(" + book + ") " + where_clause
	end
end