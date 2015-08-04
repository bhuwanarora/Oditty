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
		clause = " START books = node:node_auto_index('indexed_title: " + book_name.search_ready.gsub("(","").gsub(")","") + "') WITH books "
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

	def self.is_valid_isbn isbn_string
		output = false
		begin
			output = (isbn_string.strip.length == 10 || isbn_string.strip.length == 13) && (isbn_string.to_i > 0)
		rescue Exception => e
			puts ("Invalid ISBN:" + isbn_string).red
		end
		output
	end

	def self.parse_isbn_string isbn_string
		output = {:isbn_10 => "", :isbn_13 => ""}
		isbn_list = isbn_string.split(",")
		if isbn_list.length == 2 || isbn_list.length == 1
			isbn_list.each do |isbn|
				if BookHelper.is_valid_isbn(isbn_list[0])
					if(isbn_list[0].length == 10)
						output[:isbn_10] = isbn
					else
						output[:isbn_13] = isbn
					end
				end
			end
		end
		output
	end

end