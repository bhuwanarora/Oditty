class Status < Neo
	def initialize user_id, book_id
		@user_id = user_id
		@book_id = book_id
	end

	def match
		" MATCH (user)-[:Posted]->(status_node:StatusNode)-[:PostedContent]->(status:Status) "
	end

	def create content
		" (user)-[posted:Posted{user_id:" + @user_id.to_s + "}]->(status_node:StatusNode{user_id:" + @user_id.to_s + ",book_id:" + @book_id.to_s + ",created_at:" + Time.now.to_i.to_s + ",updated_at:" + Time.now.to_i.to_s + "})-[posted_content:PostedContent{user_id:" + @user_id.to_s + "}]->(status:Status{user_id:" + @user_id.to_s + ",book_id:" + @book_id.to_s + ",created_at:" + Time.now.to_i.to_s + ",updated_at:" + Time.now.to_i.to_s + ",content:\"" + content + "\"}) "
	end
end