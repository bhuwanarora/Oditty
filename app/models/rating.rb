class Rating < Neo
	def initialize book_id, user_id
		@user_id = user_id
		@book_id = book_id		
	end

	def create
		" MERGE (user)-[rating_action:RatingAction]->(rating_node:RatingNode{book_id:" + @book_id.to_s + ", title:book.title, author:book.author_name, user_id:" + @user_id.to_s + "})-[rate:Rate]->(book) "	
	end

end