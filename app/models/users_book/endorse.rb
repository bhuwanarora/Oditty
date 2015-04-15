class UsersBook::Endorse < UsersBook

	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
	end

	def create
		" MERGE (user)-[endorse_action:EndorseAction]->(endorse:EndorseNode{created_at: " + Time.now.to_i.to_s + ", book_id:" + @book_id.to_s + ", user_id:" + @user_id.to_s + "})-[endorsed:Endorsed]->(book) SET endorse.updated_at = " + Time.now.to_i.to_s
	end

	def self.match
		" MATCH (user)-[endorse_action:EndorseAction]->(endorse:EndorseNode)-[endorsed:Endorsed]->(book) "
	end

	def self.optional_match
		" OPTIONAL " + self.match
	end

	def add 
		operation = "+"
 		UsersBook.new(@book_id, @user_id).match + create + " WITH user, endorse, book" + User::Feed.new(@user_id).create("endorse") + ", book "+ Book::BookFeed.new(@book_id).create("endorse") + Book.set_endorse_count(operation) + User.set_total_count(Constant::InteractionPoint::Endorse, operation)
	end

	def remove
		operation = "-"
 		UsersBook.new(@book_id, @user_id).match + " WITH user, book  " + match + " WITH user, endorse, book" + User::Feed.new(@user_id).delete_feed("endorse") + ", book" + Book::BookFeed.new(@book_id).delete_feed("endorse") + Book.set_endorse_count(operation) + User.set_total_count(Constant::InteractionPoint::Endorse, operation) + " WITH endorse " + Neo.delete("endorse") 
	end
end