class Category < Neo
	
	def self.basic_info label="category"
		" ID("+label+") AS "+label+"_id, "+label+".icon AS "+label+"_icon, "+label+".name AS "+label+"_name, "+label+".aws_key AS "+label+"_aws_key, "+label+".uuid AS "+label+"_uuid"
	end

	def self.order_desc
		" ORDER BY likes.weight DESC"
	end

	def self.likes_weight
		", likes.weight AS likes_weight "
	end

	def self.get_books label="category", skip, length
		" MATCH (" + label + ")-[next_in_category:NextInCategory*" + skip.to_s + "]->(book:Book) WITH book, "+label+" MATCH path = (book)-[next_in_category:NextInCategory*" + length.to_s + "]->(category_book:Book) WHERE ALL(relation IN relationships(path) WHERE relation.uuid = "+label+".uuid) WITH "+label+", EXTRACT(n in nodes(path)|n) AS books UNWIND books AS book "
	end

	def self.get_books_for_user label="category", skip, length
		" MATCH (" + label + ")-[next_in_category:NextInCategory*" + skip.to_s + "]->(book:Book) WITH book, "+label+", user MATCH path = (book)-[next_in_category:NextInCategory*" + length.to_s + "]->(category_book:Book) WHERE ALL(relation IN relationships(path) WHERE relation.uuid = "+label+".uuid) WITH "+label+", user, EXTRACT(n in nodes(path)|n) AS books UNWIND books AS book "
	end

end