class Author < Neo

	def self.initialize name
	end

	def self.get_books
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

	def self.match_path author, book, label_defined=false
		if label_defined
			author_node =  author 
		else
			author_node = author.downcase + ":" + author.camelcase
		end
		" OPTIONAL MATCH (" + author_node + ")" + "-[:Wrote]->(" + book + ")"
	end
end