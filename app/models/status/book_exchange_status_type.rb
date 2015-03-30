class Status::BookExchangeStatusType < Status
	def initialize book_id, user_id, relation
		@relation = relation
		@book_id = book_id
		@user_id = user_id
	end
	def create 
		Book.new(@book_id).match + " MERGE (status)-[mentions_book:" + @relation + "{user_id:" + @user_id.to_s + "}]->(book) "
	end
end