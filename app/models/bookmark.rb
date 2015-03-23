class Bookmark < Neo
	# Read 									= "Read"
	# IntendingToRead 						= "IntendingToRead"
	# DidntFeelLikeReadingItAfterAPoint 		= "DidntFeelLikeReadingItAfterAPoint"
	# PretendIHaveRead 						= "PretendIHaveRead"
	# SavingForWhenIHaveMoreTime 				= "SavingForWhenIHaveMoreTime"
	# WillNeverRead 							= "WillNeverRead"
	# PurelyForShow 							= "PurelyForShow"
	# ReadButCantRememberASingleThingAboutIt 	= "ReadButCantRememberASingleThingAboutIt"
	# WishIHadntRead 							= "WishIHadntRead"
	# CurrentlyReading 						= "CurrentlyReading"
	# HaveLeftAMarkOnMe 						= "HaveLeftAMarkOnMe"
	# NotWorthReading 						= "NotWorthReading"
	# FromFacebook 							= "FromFacebook"
	# PlanToBuy 								= "PlanToBuy"
	# IOwnthis 								= "IOwnthis"
	# Visited 								= "Visited"

	def initialize(user_id, id, book_id, key)
		@user_id = user_id
		@book_id = book_id
		@key = key
	end

	def self.match label="user"
		" OPTIONAL MATCH (" + label + ")-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book) "
	end

	def match
		" MATCH (user:User), (book:Book), (label:Label) WHERE ID(user)=" + @user_id.to_s + " AND ID(book)=" + @book_id.to_s + " AND label.key = \""+@key+"\" WITH user, book, label "
	end

	def self.create_label_bookmark_node
		" (label)-[bookmarked_on:BookmarkedOn]->(bookmark_node: BookmarkNode{label:\""+@key+"\", book_id:"+@book_id.to_s+", user_id:"+@user_id.to_s+"}) " 
	end

	def self.create_bookmark_node_book
		" (bookmark_node)-[bookmark_action:BookmarkAction]->(book) "
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
		" SET bookmark_node.thumb = CASE WHEN user.thumb IS NULL THEN '' ELSE user.thumb END "
	end

	def self.label_and_labelled
		", label, labelled "
	end

	def self.create
		UsersBook.new(@user_id, @book_id).match + User.create_label(@key) + Bookmark.create_label_bookmark_node + Bookmark.create_bookmark_node_book + Bookmark.set_title + Bookmark.set_author_name + Bookmark.set_name + Bookmark.set_email + Bookmark.set_isbn + Bookmark.set_timestamp + Bookmark.set_created_at + Bookmark.set_updated_at + " WITH user, book, bookmark_node"
	end

	def self.add
		set_clause = Book.set_bookmark_count + User.set_bookmark_count + Label.set_bookmark_count + UsersLabel.set_bookmark_count + User.set_total_count_on_bookmark
		Bookmark.create + User::Feed.new(@user_id).create("bookmark_node") + Bookmark.label_and_labelled + Book::Feed.new(@user_id).create("bookmark_node") + Bookmark.label_and_labelled + set_clause
		puts "BOOK BOOKMARKED".green
	end

	def self.delete_bookmark_relations
		" MATCH (user)-[labelled:Labelled]->(label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book) DELETE bookmarked_on, bookmark_action WITH user, book, labelled, label, bookmark_node "
	end

	def self.remove
		Bookmark.new(@user_id, @book_id, @key)
		bookmark.delete_bookmark_relations
		
		feednext_clause = User::Feed.new(@user_id).delete_feed("bookmark_node") + ", labelled, label "

		bookfeed_next_clause = Book::Feed.new(@user_id).delete_feed("bookmark_node") + ", labelled, label "

		delete_node = "DELETE bookmark_node WITH user, book, label, labelled "

		set_clause = "SET b.bookmark_count = CASE WHEN b.bookmark_count IS NULL THEN 0 ELSE toInt(b.bookmark_count) - 1 END, u.bookmark_count = CASE WHEN u.bookmark_count IS NULL THEN 0 ELSE toInt(u.bookmark_count) - 1 END, l.bookmark_count = CASE WHEN l.bookmark_count IS NULL THEN 0 ELSE toInt(l.bookmark_count) - 1 END, lr.bookmark_count = CASE WHEN lr.bookmark_count IS NULL THEN 0 ELSE toInt(lr.bookmark_count) - 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN 0 ELSE toInt(u.total_count) - "+Constants::BookmarkPoints.to_s+" END"

		clause = remove_bookmark_node_clause + feednext_clause + bookfeed_next_clause + delete_node + set_clause

		puts "REMOVE BOOKMARKED".green
	end

	def self.have_left_a_mark_on_me
		match_user_to_books_clause = " WITH u, l, m, b OPTIONAL MATCH (u)-->(l)-->(m)-->(b) WITH user, COUNT(DISTINCT book) as total_book_count MATCH (user)-->(label)-->(bookmark)-->(book)-[:FromCategory]->()-[:HasRoot*0..1]->(root_category{is_root:true}) WITH total_book_count, user, root_category "
		match_user_to_category_clause = "OPTIONAL MATCH  (user)-[likes_category:Likes]->(root_category) WITH user, likes_category, root_category, total_book_count MATCH (user)-[likes_category:Likes]->(root_category) "
		set_likeability_index_clause = "SET likes_category.likeability_index = TOFLOAT(likes_category.weight*1.0/total_book_count)"
		clause = match_user_to_books_clause + match_user_to_category_clause + set_likeability_index_clause							
		
		set_favourite_clause = ", likes_category.favourite = true"
		# case @key

		# when Constants::BookLeftAMarkOnYouUpcase 
		# 	clause = update_root_category_likes_clause + set_favourite_clause
		# when Constants::FromFacebookUpcase 
		# 	clause = update_root_category_likes_clause
		# when Constants::MarkAsReadUpcase 
		# 	clause = update_root_category_likes_clause
		# else
		# 	clause = ""
		# end
		clause	
	end

end