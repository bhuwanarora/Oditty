module RestructureGraphHelper
	def convert_to_rooms label = "Genre"
		get_ids_range_clause = " MATCH (node:#{label}) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		range = get_ids_range_clause.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		range = (maximum - minimum) / 500

		while minimum < maximum
			get_nodes = " MATCH (node:#{label})  WHERE ID(node) <= #{minimum + range} AND ID(node) >= #{minimum} RETURN ID(node) as node_id" 
			minimum += range
			nodes = get_nodes.execute
			for node in nodes
				genre_id = node["node_id"]
				modify_relationships(genre_id)
			end
		end
	
	end

	def modify_relationships(genre_id)
		get_book_ids_range = " MATCH (genre: Genre)-[belongs: Belongs_to]-(book: Book) WHERE ID(genre) = #{genre_id} RETURN MAX(ID(book)) AS maximum , MIN(ID(book)) AS minimum"

		range = get_book_ids_range.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		puts minimum, maximum
		range = (maximum - minimum) / 500
		while minimum < maximum
			get_nodes = " MATCH (book: Book)-[belongs: Belongs_to]-(genre: Genre) WHERE ID(genre) = #{genre_id} AND ID(book) <= #{minimum + range} AND ID(book) >= #{minimum}  RETURN ID(book) as book_id "
			minimum += range
			nodes = get_nodes.execute
			for node in nodes
				book_id = node["book_id"]
				create_room_relation(book_id, genre_id)
				# delete_category_relation(book_id, genre_id)
			end
		end
	end

	def delete_category_relation(book_id, genre_id)
		clause = " MATCH (book: Book)-[belongs:Belongs_to]-(genre: Genre) WHERE ID(book) = #{book_id} AND ID(genre) = #{genre_id} DELETE belongs "
		clause.execute

	end

	def create_room_relation(book_id, genre_id)
		clause = " MATCH (book: Book), (genre: Genre) WHERE ID(book) = #{book_id} AND ID(genre) = #{genre_id} WITH book, genre MERGE (book)<-[related: RelatedBooks]-(genre)" 
		clause.execute	
	end

	def delete_genre_related_books label = "Genre"
		get_ids_range_clause = " MATCH (node:#{label}) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		range = get_ids_range_clause.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		range = (maximum - minimum) / 500

		while minimum < maximum
			get_nodes = " MATCH (node:#{label})  WHERE ID(node) <= #{minimum + range} AND ID(node) >= #{minimum} RETURN ID(node) as node_id" 
			minimum += range
			nodes = get_nodes.execute
			for node in nodes
				genre_id = node["node_id"]
				delete_relationships(genre_id)
			end
		end
	
	end

	def delete_relationships(genre_id)
		get_book_ids_range = " MATCH (genre: Genre)-[related: RelatedBooks]->(book: Book) WHERE ID(genre) = #{genre_id} RETURN MAX(ID(book)) AS maximum , MIN(ID(book)) AS minimum"

		range = get_book_ids_range.execute[0]
		maximum = range["maximum"]
		minimum = range["minimum"]
		puts minimum, maximum
		if maximum.present? && minimum.present?
			range = 50
			while minimum < maximum
				delete_relation = " MATCH (book: Book) WHERE ID(book) <= #{minimum + range} AND ID(book) >= #{minimum}  WITH book MATCH (book)<-[related:RelatedBooks]-(genre:Genre) WHERE ID(genre) = #{genre_id} DELETE related" 
				minimum += range
				delete_relation.execute
			end
			# range = (maximum - minimum) / 500
			# while minimum < maximum
			# 	get_nodes = " MATCH (book: Book) WHERE ID(book) <= #{minimum + range} AND ID(book) >= #{minimum}  RETURN ID(book) as book_id" 
			# 	minimum += range
			# 	nodes = get_nodes.execute
			# 	for node in nodes
			# 		book_id = node["book_id"]
			# 		delete_related_books_relation(book_id, genre_id)
			# 		# delete_category_relation(book_id, genre_id)
			# 	end
			# end
		end
	end

	def delete_related_books_relation(book_id, genre_id)
		clause = " MATCH (book: Book)<-[related: RelatedBooks]-(genre: Genre) WHERE ID(book) = #{book_id} AND ID(genre) = #{genre_id} DELETE related "
		clause.execute
	end
end