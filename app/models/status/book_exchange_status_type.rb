class Status::BookExchangeStatusType < Status
	def initialize book_id, user_id, relation
		@relation = relation
		@book_id = book_id
		@user_id = user_id
	end
	def create 
		" MATCH (book) WHERE ID(book) = " + @book_id.to_s + " MERGE (status)-[:" + @relation + "{user_id:" + @user_id.to_s + "}]->(book)"
	end
end