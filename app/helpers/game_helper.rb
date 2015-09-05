module GameHelper

	def self.create_book_linked_list
		clause = "MATCH (b:Book) "\
			" WHERE b.goodness_index > 7 AND b.isbn IS NOT NULL "\
			" FOREACH(i in RANGE(0, length(p)-2) | "\
				" FOREACH(p1 in [p[i]] |  "\
					" FOREACH(p2 in [p[i+1]] |  "\
						" CREATE UNIQUE (p1)-[:NextJudge]->(p2)))) "
		clause.execute
	end

end