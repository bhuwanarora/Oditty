class Endorse < Neo
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
	end

	def create
		" MERGE (user)-[endorse_action:EndorseAction]->(endorse:EndorseNode{created_at: " + Time.now.to_i.to_s + ", book_id:" + @book_id.to_s + ", user_id:" + @user_id.to_s + ", updated_at:  " + Time.now.to_i.to_s + "})-[endorsed:Endorsed]->(book) "
	end
end