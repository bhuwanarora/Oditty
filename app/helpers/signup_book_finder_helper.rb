module SignupBookFinderHelper
	def find_books_on_count user_id
		begin
			count = count.to_i
			user_id = 
			case count
			when 0..20
				clause = " MATCH (user:User)--() WHERE ID(user) = " + user_id.to_s + 
		rescue Exception => e
			output = e.to_s
			status = 500
	end
end