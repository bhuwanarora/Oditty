class Bookmark < Neo
	def initialize(user_id, media_id, key)
		@user_id = user_id
		@media_id = media_id
		@key = key
	end

	def news
		@media_class = Article::News
		@user_media_class = UsersNews
		@media_label_class = Bookmark::Node::NewsLabel
		@media_label = "News"
		@media = "news"
		self
	end

	def book
		@media_class = Book
		@media_feed_class = Book::BookFeed
		@user_media_class = UsersBook
		@media_label_class = Bookmark::Node::BookLabel
		@media_label = "Book"
		@media = "book"
		self
	end

	def blog
		@media_class = Article::Blog
		@user_media_class = UsersBlog
		@media_label_class = Bookmark::Node::BlogLabel
		@media_label = "Blog"
		@media = "blog"
		self
	end

	def self.match_not media
		" WHERE NOT (user)-[:Labelled]->(:Label)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(" + media.downcase + ") "
	end

	def self.match_path media, end_label_defined=false, label="user"
		if end_label_defined
			ending_node = "(" + media.downcase + ")"
		else
			ending_node = "(" + media.downcase + ":"  + media.camelcase + ")"
		end
		" OPTIONAL MATCH (" + label + ")-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->" + ending_node
	end

	def self.optional_match_label media = "book"
		" OPTIONAL MATCH (label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(" + media + ") "
	end

	def self.match media = "book"
	 	" OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(" + media + ") "
	end

	def self.create_bookmark_node_book media = "book"
		" CREATE UNIQUE (bookmark_node)-[bookmark_action:BookmarkAction]->(" + media + ") "
	end

	def self.set_title media = "book"
		" SET bookmark_node.title = " + media + ".title "
	end

	def self.set_author_name media="book"
		" SET bookmark_node.author = " + media + ".author_name "
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
		" SET bookmark_node.thumb = COALESCE(user.thumb,\"\") "
	end

	def self.label_and_labelled
		", label, labelled "
	end

	def self.set_timestamp
		" SET bookmark_node.timestamp = " + Time.now.to_i.to_s + " "
	end

	def self.set_key key=nil
		" SET bookmark_node.key = \""+ key + "\" "
	end

	def self.delete_bookmark_relations media="book"
		"  DELETE bookmarked_on, bookmark_action WITH user, " + media + ", labelled, label, bookmark_node "
	end

	def self.delete_bookmark
		" MATCH ()-[relation]-(bookmark_node) DELETE relation, bookmark_node "
	end

	def create_bookmark_node_book
		" CREATE UNIQUE (bookmark_node)-[bookmark_action:BookmarkAction]->(" + @media + ") "
	end

	def set_title
		" SET bookmark_node.title = COALESCE(" + @media + ".title,\"\") "
	end

	def set_author_name
		" SET bookmark_node.author = COALESCE(" + @media + ".author_name,\"\") "
	end

	def set_isbn
		" SET bookmark_node.isbn = COALESCE(" + @media + ".isbn,\"\") "
	end

	def set_key key=nil
		key ||= @key
		" SET bookmark_node.key = \""+ key + "\" "
	end


	def delete_bookmark_relations
		"  DELETE bookmarked_on, bookmark_action WITH user, " + @media + ", labelled, label, bookmark_node "
	end

	def self.have_left_a_mark_on_me
		match_user_to_books_clause = " WITH u, l, m, b OPTIONAL MATCH (u)-->(l)-->(m)-->(b) WITH user, COUNT(DISTINCT book) as total_book_count MATCH (user)-->(label)-->(bookmark)-->(media)-[:FromCategory]->()-[:HasRoot*0..1]->(root_category{is_root:true}) WITH total_book_count, user, root_category "
		match_user_to_category_clause = "OPTIONAL MATCH  (user)-[likes_category:Likes]->(root_category) WITH user, likes_category, root_category, total_book_count MATCH (user)-[likes_category:Likes]->(root_category) "
		set_likeability_index_clause = "SET likes_category.likeability_index = TOFLOAT(likes_category.weight*1.0/total_book_count)"
		clause = match_user_to_books_clause + match_user_to_category_clause + set_likeability_index_clause							
		
		set_favourite_clause = ", likes_category.favourite = true"
		clause	
	end

	def self.basic_info
		" ID(bookmark_node) AS status , bookmark_node.name AS bookmarked_by, bookmark_node.timestamp AS time "
	end

	def self.grouped_basic_info
		" {status: ID(bookmark_node), bookmarked_by: bookmark_node.name, time: bookmark_node.timestamp} AS bookmark_node "
	end

	def create_label_bookmark_node
		" CREATE UNIQUE (label)-[bookmarked_on:BookmarkedOn]->(bookmark_node: BookmarkNode{label:\""+@key+"\", book_id:"+ @media_id.to_s + ", user_id:" + @user_id.to_s + "}) " 
	end

	def match
		" MATCH (user:User), (" + @media + ":" + @media_label + "), (label:Label) WHERE ID(user)=" + @user_id.to_s + " AND ID(" + @media + ")=" + @media_id.to_s + " AND label.key = \""+@key+"\" WITH user, " + @media + ", label "
	end

	def set_properties operation
		@media_class.set_bookmark_count(operation) + User.set_bookmark_count(operation) + Label.set_bookmark_count(operation) + UsersLabel.set_bookmark_count(operation) + User.set_total_count(Constant::InteractionPoint::Bookmark, operation) + Bookmark.with_group("user", @media , "bookmark_node", "labelled", "label")
	end
	
	def remove  
		operation = "-"
		feednext_clause = User::Feed.new(@user_id).delete_feed("bookmark_node") + ", " + @media + ", labelled, label "
		mediafeed_next_clause = @media == "book" ? @media_feed_class.delete_feed("bookmark_node", @user_id) + ", labelled, label " : ""
		puts "REMOVE BOOKMARKED".green
		match + @media_label_class.match_path + delete_bookmark_relations + set_properties(operation) + feednext_clause + mediafeed_next_clause + Bookmark.delete_bookmark
	end

	def create 
		@user_media_class.new(@media_id, @user_id).match + User.create_label(@key) + create_label_bookmark_node + create_bookmark_node_book + Bookmark.set_updated_at + Bookmark.set_created_at + set_key(@key) + " WITH user, " + @media + ", bookmark_node, label, labelled "
	end

	def add  
		operation = "+"
		if @key == "Visited"
			end_clause = Bookmark.return_group(Bookmark.basic_info)
			feednext_clause = ""
			mediafeed_next_clause = ""
		else
			feednext_clause = User::Feed.new(@user_id).create("bookmark_node") + Bookmark.label_and_labelled + ", " + @media
			mediafeed_next_clause = @media == "book" ? @media_feed_class.new(@user_id).create("bookmark_node") + Bookmark.label_and_labelled : "" 
		end
		puts "BOOK BOOKMARKED".green
		create + feednext_clause + mediafeed_next_clause  + set_properties(operation) + Bookmark.return_group(@media_class.basic_info) 
	end
end