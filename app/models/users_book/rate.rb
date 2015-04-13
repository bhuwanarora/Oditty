class UsersBook::Rate < UsersBook
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
	end

	def add rating
		operation = "+"
		match + create + UsersBook::Rate.set_rating(rating) + UsersBook::Rate.set_name + UsersBook::Rate.set_email + UsersBook::Rate.set_isbn + UsersBook::Rate.set_thumb + " WITH user, book, rating_node " + Book.set_rating_count(operation) + User.set_rating_count(operation) + User.set_total_count(Constant::InteractionPoint::Rating, operation) + " WITH user, book, rating_node " + User::Feed.new(@user_id).create("rating_node") + Book::Feed.new(@book_id).create("rating_node") + UsersBook.return_init + " rating_node.rating " 
		
	end

	def initialize book_id, user_id
		@user_id = user_id
		@book_id = book_id		
	end

	def create
		" MERGE (user)-[rating_action:RatingAction]->(rating_node:RatingNode{book_id:" + @book_id.to_s + ", title:book.title, author:book.author_name, user_id:" + @user_id.to_s + "})-[rate:Rate]->(book) "	
	end

	def self.optional_match
		" OPTIONAL MATCH (user)-[rating_action:RatingAction]->(rating_node:RatingNode)-[rate:Rate]->(book) "
	end

	def self.set_rating rating
		"SET rating_node.rating=" + rating.to_s + " "
	end

	def self.set_rating_count
		
	end

	def self.set_title
		" SET rating_node.title = book.title "
	end

	def self.set_author_name
		" SET rating_node.author = book.author_name "
	end

	def self.set_name
		" SET rating_node.name = user.name "
	end

	def self.set_email
		" SET rating_node.email=user.email "
	end

	def self.set_isbn
		" SET rating_node.isbn = book.isbn "
	end

	def self.set_created_at
		" SET rating_node.created_at = " + Time.now.to_i.to_s + " "
	end

	def self.set_updated_at
		" SET rating_node.updated_at = " + Time.now.to_i.to_s + " "
	end

	def self.set_thumb
		" SET rating_node.thumb = COALESCE(user.thumb,'') "
	end

	def self.set_timestamp
		" SET rating_node.timestamp = " + Time.now.to_i.to_s + " "
	end
end