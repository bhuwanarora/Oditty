module BookHelper
	
	def self.set_author_list author_name_list,book_id
		set_clause = "SET book.author_name_list = ["
		author_name_list.each do |author_name|
			set_clause += " \'" + author_name.gsub("\'","\\\\'") + "\',"
		end
		set_clause[set_clause.length - 1 ] =']'
		Book.new(book_id).match + set_clause
	end

	def self.get_by_one_author book_name, author_name_list
		replace_dictionary = {"@" => "", "."  => ""}
		clause = " MATCH (books:Book) WHERE books.indexed_title = \'" + book_name.search_ready + "\' "
		or_clause = " "
		author_name_list.each_with_index do |author_name,index|
			if index == 0
				or_clause += Neo4jHelper.cypher_replace("books.indexed_author_name", replace_dictionary)+ " = \'" + author_name.search_ready + "\'"
			else
				or_clause += " OR " + Neo4jHelper.cypher_replace("books.indexed_author_name", replace_dictionary)+ " = \'" + author_name.search_ready + "\'"
			end
		end
		clause += "WITH (CASE WHEN " + or_clause + " THEN [books] ELSE [] END ) AS books "
		clause
	end

end