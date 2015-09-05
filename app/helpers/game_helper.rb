module GameHelper

	def self.create_book_linked_list
		clause = "MATCH (b:Book) "\
			" WHERE b.goodness_index > 7 AND b.isbn IS NOT NULL "\
			" FOREACH(i in RANGE(0, length(b)-2) | "\
				" FOREACH(b1 in [b[i]] |  "\
					" FOREACH(b2 in [b[i+1]] |  "\
						" CREATE UNIQUE (b1)-[:NextJudge]->(b2)))) "
		clause.execute
	end

end