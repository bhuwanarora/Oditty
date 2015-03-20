class Bookmark::Object::Book < Bookmark::Object
	
	def self.match_clause
		"MATCH (user:User), (book:Book) WHERE ID(user) = " + @user_id.to_s + " AND ID(book) = " + @id.to_s + " "
	end
end