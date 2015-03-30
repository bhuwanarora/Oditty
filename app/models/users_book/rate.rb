class UsersBook::Rate < UsersBook
	def initialize book_id, user_id
		@book_id = book_id
		@user_id = user_id
	end

	def add rating
		operation = "+"
		puts "RATE".green
		#update mark as read cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update mark as read cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
		UsersBook.new(@book_id, @user_id).match + Rating.new(@book_id, @user_id).create + Rating.set_rating(rating) + Rating.set_name + Rating.set_email + Rating.set_isbn + Rating.set_thumb + " WITH user, book, bookmark " + Book.set_bookmark_count(operation) + User.set_total_count(operation) + User::Feed.new(@user_id).create("rating_node") + Book::Feed.new(@book_id).create("rating_node") 
	end
end