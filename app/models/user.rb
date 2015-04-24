class User < Neo

	def initialize user_id, skip_count=0
		@id = user_id
	end

	def self.link_primary_labels
		" CREATE (user)-[:Labelled{user_id:ID(user)}]->(label) WITH user, label "
	end

	def self.match_group ids
		clause = ""
		unless ids.nil?
			for id in ids do 
				if clause.present?
					clause = clause + " OR "
				else
					clause = " WHERE "
				end
				clause = clause + " ID(user) = " + id.to_s
			end
		end
		clause = " MATCH (user:User) " + clause
		clause
	end

	def self.set_bookmark_count operation
		if operation == "+"
			" SET user.bookmark_count = TOINT(COALESCE(user.bookmark_count, 0)) + 1 "
		else
			" SET user.bookmark_count = TOINT(COALESCE(user.bookmark_count, 1)) - 1 "
		end
	end

	def optional_match_books_bookmarked
		" OPTIONAL MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book:Book) WITH user, label, bookmarked_on, bookmark_node, bookmark_action, book "
	end

	def authors_of_books_bookmarked
		optional_match_books_bookmarked + Author.match_author_for_books + ", user "
	end

	def favourite_author
		optional_match_books_bookmarked + Author.match_author_for_books + ", user, COUNT(book) as book_count " 
	end

	def self.set_rating_count operation
		if operation == "+"
			" SET user.rating_count = TOINT(COALESCE(user.rating_count, 0)) + 1 "
		else
			" SET user.rating_count = TOINT(COALESCE(user.rating_count, 1)) - 1 "
		end
	end

	def self.set_total_count value, operation
		if operation == "+"
			" SET user.total_count = TOINT(COALESCE(user.total_count, 0)) + " + value.to_s + " "
		else
			" SET user.total_count = TOINT(COALESCE(user.total_count, " + value.to_s + ")) - " + value.to_s + " "
		end
	end

	def get_detailed_info
		match + User.match_likeable_root_category + Bookmark::Type::HaveLeftAMarkOnMe.match(@id) + ", root_category " + User.return_group(User.basic_info, "COLLECT(DISTINCT(root_category.name)) AS categories_name", "COLLECT(DISTINCT(ID(root_category))) AS categories_id", "COLLECT(DISTINCT(root_category.aws_key)) AS categories_aws_key", "COLLECT(DISTINCT(book.isbn)) AS books_isbn", "COLLECT(DISTINCT(ID(book))) AS books_id", "COLLECT(DISTINCT(book.title)) AS books_title", "COLLECT(DISTINCT(book.author_name)) AS books_author_name")
	end

	def get_profile_info_and_follow_status id
		match + User.match_likeable_root_category + Bookmark::Type::HaveLeftAMarkOnMe.match(@id) + ", root_category " + match_follower(id) + " , root_category, book " + User.return_group(User.basic_info, "COLLECT(DISTINCT(root_category.name)) AS categories_name", "COLLECT(DISTINCT(ID(root_category))) AS categories_id", "COLLECT(DISTINCT(root_category.aws_key)) AS categories_aws_key", "COLLECT(DISTINCT(book.isbn)) AS books_isbn", "COLLECT(DISTINCT(ID(book))) AS books_id", "COLLECT(DISTINCT(book.title)) AS books_title", "COLLECT(DISTINCT(book.author_name)) AS books_author_name", " ID(follows_node) AS status ")
	end

	def match_follower user_id
		" MATCH (friend)-[follows_user:FollowsUser]->(follows_node:FollowsNode)-[followed_by:FollowedBy]->(user) WHERE ID(friend) = " + user_id.to_s + " WITH user, friend, follows_node "
	end

	def get_basic_info
		match + User.return_init + User.basic_info
	end

	def self.basic_info
		" user.init_book_read_count AS init_book_read_count, user.selectedYear AS selectedYear, user.selectedMonth AS selectedMonth, user.selectedDay AS selectedDay, user.first_name AS first_name, user.last_name AS last_name, user.about AS about, ID(user) AS id "
	end

	def self.grouped_basic_info
		"  init_book_read_count:user.init_book_read_count ,  selectedYear:user.selectedYear ,  selectedMonth:user.selectedMonth ,  selectedDay:user.selectedDay ,  first_name:user.first_name ,  last_name:user.last_name ,  about:user.about ,  id:ID(user) "
	end

	def get_all_books skip_count=0, limit_count=Constant::Count::BookCountShownOnSignup 
		match + Bookmark::Node::BookLabel.match_path + User.return_group(Book.basic_info, " label.key as shelf ") + Book.order_desc + User.skip(skip_count) + User.limit(limit_count)
	end

	def self.create_label key
		" CREATE UNIQUE (user)-[labelled:Labelled]->(label:Label{key: \""+key+"\"}) "
	end

	def self.from_facebook params
		begin
			if params[:data].class == Array
				params[:data].each do |book_data|
					book = book_data["data"]["book"]
					indexed_title = book["title"].gsub(" ", "").downcase
					url_splitter = book["url"].split("/")
					url_id = url_splitter[url_splitter.length - 1]
					progress = book_data["data"]["progress"]
					activity_id = book_data["data"]["id"]

					clause = "MATCH (b:Book) WHERE book.url =~ '.*"+url_id+"' RETURN ID(b)"
					puts clause.blue.on_red
				end
			end
		rescue Exception => e
			puts e.to_s.red
		end
	end

	def self.match_label
		" OPTIONAL MATCH (user)-[:Labelled]->(user_label:Label) "
	end

	def self.create(email, password=nil, verification_token=nil)
		"CREATE (user:User{email:\""+email+"\", verification_token:\""+verification_token+"\", password:\""+password+"\", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, last_book: "+Constant::Id::BestBook.to_s+", amateur: true, ask_info: true, verification_time " + Time.now.to_i.to_s + "}) "
	end

	def self.link_root_categories
		"  CREATE UNIQUE (user)-[rel:Likes]-(root_category) SET rel.weight = 0 WITH user , root_category "
	end

	def self.handle_new(email, password=nil, verification_token=nil)
		User.create(email, password, verification_token) + User::Feed.create_first + Label.match_primary  + ", user " + User.link_primary_labels + User::UserNotification.create_for_new_user + Category::Root.match  + ", user " + User.link_root_categories + Notification.create_for_new_user + User.return_init + User.basic_info
	end

	def get_notifications
		User::UserNotification.match_last_visited_notification(@id) + User::UserNotification.delete_visited_notification  + " WITH user " + User::UserNotification.create_visited_notification + User::UserNotification.match_path  + "," + User::UserNotification.extract_unwind("notification") + " WITH " + User.tail("notification") + User.return_group("labels(notification)", "notification", "notification.created_at") + User.order_init + " notification.created_at DESC " 
	end

	def get_books_bookmarked(skip_count=0)
		match + optional_match_books_bookmarked + User.return_group(Book.basic_info, " COLLECT(label.name) as labels ") + User.skip(skip_count) + User.limit(10)
	end

	def get_public_labels
		match + UsersLabel.match + User.return_group(Label.basic_info)
	end

	def match_bookmark
		" MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book:Book) WHERE bookmark_node.user_id = " + @id.to_s + " "
	end

	def approve_thumb_request(status, id)
		"MATCH (u:User)-[r1:DataEdit]->(t:ThumbRequest)-[r2:DataEditRequest]->(b:Book) WHERE ID(t)="+id.to_s+" SET t.status = "+status.to_s+", b.external_thumb = CASE WHEN "+status.to_s+" = 1 THEN t.url ELSE null END"
	end

	def match node_variable = "user"
		" MATCH (" + node_variable + ":User) WHERE ID(" + node_variable + ") = " + @id.to_s + " WITH " + node_variable + " "
	end

	def self.match_root_category category_id=nil
		if category_id
			clause = " MATCH (user)-[likes:Likes]->(root_category:Category{is_root:true}) WHERE ID(category)="+category_id.to_s
		else
			clause = " MATCH (user)-[likes:Likes]->(root_category:Category{is_root:true}) "
		end
		clause
	end

	def self.match_category category_id=nil
		if category_id
			clause = " MATCH (user)-[likes:Likes]->(category:Category) WHERE ID(category)="+category_id.to_s+" WITH user, category, likes "
		else
			clause = " MATCH (user)-[likes:Likes]->(category:Category) WITH user, category, likes "
		end
		clause
	end

	def self.match_likeable_category(label="category", category_id=nil)
		if category_id
			clause = " MATCH (user)-[likes:Likes]->("+label+":Category) WHERE ID("+label+")="+category_id.to_s+" AND likes.weight > 0 WITH user, "+label+", likes "
		else
			clause = " MATCH (user)-[likes:Likes]->("+label+":Category) WHERE likes.weight > 0 WITH user, "+label+", likes "
		end
		clause
	end

	def self.match_likeable_root_category category_id=nil
		clause = " MATCH (user)-[likes:Likes]->(root_category:Category) WHERE "
		if category_id
			clause = clause + "ID(root_category)="+category_id.to_s+" AND "
		end
		clause = clause + "likes.weight > 0 AND root_category.is_root = true WITH user, root_category, likes "
		clause
	end

	def self.match_custom_likeable_root_category max=true, category_id=nil
		custom = max ? " DESC " : ""
		clause = " MATCH (user)-[likes:Likes]->(root_category:Category) WHERE "
		if category_id
			clause = clause + " ID(root_category)="+category_id.to_s+" AND "
		end
		clause = clause + "likes.weight > 0 AND root_category.is_root = true WITH root_category, user, likes " + self.order_init + " likes.weight " + custom + self.limit(1)
		clause
	end

	def self.optional_match_category category_id=nil
		" OPTIONAL" + User.match_category(category_id)
	end

	def self.init_book_read_count
		" user.init_book_read_count as init_book_read_count "
	end

	def get_init_book_count_range
		match + User.return_init + User.init_book_read_count
	end

	def match_community
		" MATCH (user)-[follows_user:FollowsCommunity]->(follows_node:FollowsNode)-[followed_by:FollowedBy]->(community) "
	end

	def self.get_by_fb_id id
		" MATCH (user:User{fb_id:" + id.to_s + "}) " + User::Info.return_init + User.basic_info
	end

	def self.match_by_email email
		" MATCH (user:User) WHERE user.email= \"" + email + "\" "
	end

	def self.get_by_email email
		User.match_by_email(email) + User::Info.return_init + User.basic_info
	end

	def self.authentication_info
		" user.password AS password , user.verified AS verified, user.active AS active "
	end

	def self.get_sign_in_credential_by_email email
		User.match_by_email(email) + User::Info.return_group(User.basic_info, User.authentication_info)  
	end

	def self.match_by_email_verification_token email, verification_token
	    User.match_by_email(email) + " AND user.verification_token=\"" + verification_token + "\""
	end	

	def self.handle_verification email, verification_token
		User.match_by_email_verification_token(email, verification_token) + User::Info.set_verified_true + User.return_group(User.basic_info, User.authentication_info) 
	end

	def self.handle_new_verification_request email, verification_token
		User.match_by_email(email) + User::Info.set_verification_token(verification_token) + User::Info.set_verification_time + User.return_init + User.basic_info
	end

	def match_followers
		match + " WITH user AS friend " + UsersUser.match 
	end

	def self.get_visited_books
		Bookmark::Type::Visited.match("book") + Book.order_desc + Book.limit(3)  +" WITH user, " + Book.collect_map("books" => Book.grouped_basic_info )
	end

	def get_followers
		match_followers + User.get_visited_books + User.return_group(User.basic_info,"books")
	end

	def match_users_followed
		match + UsersUser.match + " WITH friend AS user "  
	end

	def get_users_followed
		match_users_followed + User.get_visited_books + User.return_group(User.basic_info,"books") 
	end
end