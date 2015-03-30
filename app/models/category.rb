class Category < Neo
	def initialize id
		@id = id
	end

	def match
		" MATCH (category:Category) WHERE ID(category) = " + @id.to_s + " WITH category "
	end

	def self.basic_info node_variable="category"
		" ID("+node_variable+") AS "+node_variable+"_id, "+node_variable+".icon AS "+node_variable+"_icon, "+node_variable+".name AS "+node_variable+"_name, "+node_variable+".aws_key AS "+node_variable+"_aws_key, "+node_variable+".uuid AS "+node_variable+"_uuid"
	end

	def self.order_desc
		" ORDER BY likes.weight DESC"
	end

	def self.likes_weight
		", likes.weight AS likes_weight "
	end

	def self.get_books node_variable="category", skip, length
		" MATCH (" + node_variable + ")-[next_in_category:NextInCategory*" + skip.to_s + "]->(book:Book) WITH book, "+node_variable+" MATCH path = (book)-[next_in_category:NextInCategory*" + length.to_s + "]->(category_book:Book) WHERE ALL(relation IN relationships(path) WHERE relation.uuid = "+node_variable+".uuid) WITH "+node_variable+", EXTRACT(n in nodes(path)|n) AS books UNWIND books AS book "
	end

	def self.get_books_for_user node_variable="category", skip, length
		" MATCH (" + node_variable + ")-[next_in_category:NextInCategory*" + skip.to_s + "]->(book:Book) WITH book, "+node_variable+", user MATCH path = (book)-[next_in_category:NextInCategory*" + length.to_s + "]->(category_book:Book) WHERE ALL(relation IN relationships(path) WHERE relation.uuid = "+node_variable+".uuid) WITH "+node_variable+", user, EXTRACT(n in nodes(path)|n) AS books UNWIND books AS book "
	end

	def self.match_path
		" MATCH (category:Category)-[:FromCategory]-(book)"
	end

	def get_books
		" MATCH (category:Category)-[:FromCategory]-(book) WHERE ID(category) = " + @id.to_s + " "
	end

end