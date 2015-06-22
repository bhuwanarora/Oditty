class UsersFacebookBook < Neo
	def initialize(book_id, user_id)
		@book_id = book_id
		@user_id = user_id
	end

	def match 
		" MATCH (book:FacebookBook), (user:User) WHERE ID(book)="+@book_id.to_s+" AND ID(user)="+@user_id.to_s+" WITH user, book "
	end
end