class Status::BookExchangeStatusType < Status
	def create relation, book_id, user_id
		" MATCH (book) WHERE ID(book) = " + book_id.to_s + " MERGE (status)-[:" + relation + "{user_id:" + user_id.to_s + "}]->(book)"
	end
end