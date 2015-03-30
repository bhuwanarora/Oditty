class Rating < Neo
	def initialize book_id, user_id
		@user_id = user_id
		@book_id = book_id		
	end

	def create
		" MERGE (user)-[rating_action:RatingAction]->(rating_node:RatingNode{book_id:" + @book_id.to_s + ", title:book.title, author:book.author_name, user_id:" + @user_id.to_s + "})-[rate:Rate]->(book) "	
	end

def self.set_rating rating
		"SET bookmark_node.rating=" + rating.to_s + " "
	end

	def self.set_title
		" SET bookmark_node.title = book.title "
	end

	def self.set_author_name
		" SET bookmark_node.author = book.author_name "
	end

	def self.set_name
		" SET bookmark_node.name = user.name "
	end

	def self.set_email
		" SET bookmark_node.email=user.email "
	end

	def self.set_isbn
		" SET bookmark_node.isbn = book.isbn "
	end

	def self.set_created_at
		" SET bookmark_node.created_at = " + Time.now.to_i.to_s + " "
	end

	def self.set_updated_at
		" SET bookmark_node.updated_at = " + Time.now.to_i.to_s + " "
	end

	def self.set_thumb
		" SET bookmark_node.thumb = COALESCE(user.thumb,"") "
	end

	def self.label_and_labelled
		", label, labelled "
	end

	def self.set_timestamp
		" SET bookmark_node.timestamp = " + Time.now.to_i.to_s + " "
	end
end