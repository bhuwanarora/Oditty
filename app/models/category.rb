class Category < Neo
	def initialize id
		@id = id
		# TODO
		# first book in category
		# @first_book
	end

	def match
		" MATCH (category:Category) WHERE ID(category) = " + @id.to_s + " WITH category "
	end

	def self.basic_info node_variable="category"
		" ID("+node_variable+") AS "+node_variable+"_id, "+node_variable+".icon AS "+node_variable+"_icon, "+node_variable+".name AS "+node_variable+"_name, "+node_variable+".aws_key AS "+node_variable+"_aws_key, "+node_variable+".uuid AS "+node_variable+"_uuid"
	end

	def self.grouped_basic_info node_variable="category"
		" {id: ID("+node_variable+"), icon: "+node_variable+".icon, name: "+node_variable+".name, aws_key: "+node_variable+".aws_key, uuid: "+node_variable+".uuid} "
	end

	def self.order_desc
		" ORDER BY likes.weight DESC"
	end

	def self.likes_weight
		", likes.weight AS likes_weight "
	end

	def self.match_books_in_list node_variable="category", skip, length
		" MATCH (" + node_variable + ")-[next_in_category:NextInCategory*" + skip.to_s + "]->(book:Book) WITH book, "+node_variable+" MATCH path = (book)-[next_in_category:NextInCategory*" + length.to_s + "]->(category_book:Book) WHERE ALL(relation IN relationships(path) WHERE relation.uuid = "+node_variable+".uuid) WITH "+node_variable+", EXTRACT(n in nodes(path)|n) AS books UNWIND books AS book "
	end

	def self.books_for_user node_variable="category", skip, length
		" MATCH (" + node_variable + ")-[next_in_category:NextInCategory*" + skip.to_s + "]->(book:Book) WITH book, "+node_variable+", user MATCH path = (book)-[next_in_category:NextInCategory*" + length.to_s + "]->(category_book:Book) WHERE ALL(relation IN relationships(path) WHERE relation.uuid = "+node_variable+".uuid) WITH "+node_variable+", user, EXTRACT(n in nodes(path)|n) AS books UNWIND books AS book "
	end

	def match_nth_book skip
		" MATCH (book:Book)-[:NextInCategory*.."+skip.to_s+"]->(nth_book) WHERE ID(book)="+@first_book.to_s+" WITH nth_book as book "
	end

	def match_books_after skip, count
		match_nth_book(skip) + " MATCH path=(book)-[:NextInCategory*.."+count.to_s+"]->(last_book) WITH EXTRACT (n IN nodes(path)|n) AS books UNWIND books AS book  "
	end

	def self.match_books category="category"
		" MATCH ("+category+":Category)-[:FromCategory]-(book) WITH "+category+", book "
	end

	def match_books category="category"
		" MATCH ("+category+":Category)-[:FromCategory]-(book:Book) WHERE ID("+category+") = " + @id.to_s + " WITH "+category+", book "
	end
end