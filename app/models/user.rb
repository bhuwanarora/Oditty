class User < Neo

	def initialize user_id, skip_count=0
		# @limit = Constants::BookCountShownOnSignup
		@id = user_id
		# @skip_count = skip_count
	end

	def get_detailed_info
		match + User.optional_category_clause + Bookmark::Type::HaveLeftAMarkOnMe.match(@id) + return_init + " COLLECT(DISTINCT(category.name)), COLLECT(DISTINCT(ID(category))), COLLECT(DISTINCT(category.icon)), COLLECT(DISTINCT(book.isbn)), COLLECT(DISTINCT(ID(book))), COLLECT(DISTINCT(book.title)), COLLECT(DISTINCT(book.author_name))"
	end

	def self.basic_info
		" ID(user) AS id, user.first_name AS first_name, user.last_name AS last_name "
	end

	def self.get_by_email email
		" MATCH (user:User) WHERE user.email= \"" + email + "\" " + return_init + User.basic_info
	end

	def self.set_email email
		" SET user.email = \""+email+"\" "
	end

	def self.set_thumb thumb
		" SET user.thumb = \""+thumb+"\" "
	end

	def self.set_name name
		" SET user.name = \""+name+"\", user.indexed_user_name=\""+name.downcase.gsub(" ","")+"\", user.search_index=\""+name.downcase.gsub(" ","")+"\""
	end

	def self.set_first_name first_name
		" SET user.first_name=\""+first_name+"\""
	end

	def self.set_last_name last_name
		" SET user.last_name=\""+last_name+"\""
	end

	def self.set_location latitude, longitude
		" SET user.latitude="+latitude.to_s+", user.longitude="+longitude.to_s
	end

	def self.set_init_book_read_count init_book_read_count
		" SET user.init_book_read_count=\""+init_book_read_count+"\"" if init_book_read_count
	end

	def self.set_gender gender
		" SET user.gender=\""+gender+"\" "
	end

	def self.set_date_of_birth selected_year, selected_month, selected_day
		" SET user.selectedYear="+selectedYear.to_s+", user.selectedMonth=\""+selectedMonth.to_s+"\", user.selectedDay="+selectedDay.to_s+" "
	end

	def self.set_profile type
		" SET user.profile=\""+profile+"\" "
	end

	def self.set_profile_picture profile_picture
		" SET user.profile_picture="+profile_picture+" "
	end

	def self.set_about about
		" SET user.about=\""+about+"\" "
	end

	def self.set_category category_id
		self.category_clause(category_id) + " SET likes.weight = likes.weight + " + Constants::CategoryLikeWeight.to_s
	end

	def self.remove_category category_id
		self.category_clause(category_id) + " SET likes.weight = likes.weight - " + Constants::CategoryLikeWeight.to_s
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
		create_new_user = "CREATE (user:User{email:\""+email+"\", verification_token:\""+verification_token+"\", password:\""+password+"\", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, last_book: "+Constants::BestBook.to_s+", amateur: true, ask_info: true}), "
		create_feednext_relation = "(user)-[fn:FeedNext{user_id:ID(user)}]->(user), "
		create_ego_relation = "(user)-[:Ego{user_id:ID(user)}]->(user) WITH user "
		get_labels = "MATCH(bm:Label{primary_label:true}) "
		add_labels = "CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm) "
		add_categories_to_user = "WITH user MERGE (user)-[rel:Likes]-(root_category:Category{is_root:true}) ON CREATE SET rel.weight = 0 "
		# get_all_users = "MATCH (all_user:User) WHERE all_user <> user "
		# make_friends = "CREATE (user)-[:Follow]->(all_user), (user)<-[:Follow]-(all_user)"
		clause = create_new_user + create_feednext_relation + create_ego_relation + get_labels + add_labels + add_categories_to_user
		clause
	end

	def get_notifications
		return_clause = "RETURN n, ID(n)"
		clause = match + "MATCH (u)-[r]->(n:Notification) " + return_clause
		clause
	end

	def get_bookmark_labels
		match + User.label_clause + return_init + Label.get_basic_info
	end

	def get_books_bookmarked(skip_count=0)
		match + return_init + Book.get_basic_info + ", COLLECT(label.name) as labels SKIP "+skip_count.to_s+" LIMIT 10"
	end

	def match_bookmark
		" MATCH (user)-[labelled:Labelled]->(label:Label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book:Book) WHERE bookmark_node.user_id = " + @id.to_s + " "
	end

	def approve_thumb_request(status, id)
		"MATCH (u:User)-[r1:DataEdit]->(t:ThumbRequest)-[r2:DataEditRequest]->(b:Book) WHERE ID(t)="+id.to_s+" SET t.status = "+status.to_s+", b.external_thumb = CASE WHEN "+status.to_s+" = 1 THEN t.url ELSE null END"
	end

	def match
		" MATCH (user:User) WHERE ID(user) = " + @id.to_s + " WITH user "
	end

	def self.match_root_category category_id
		if category_id
			clause = " MATCH (user)-[likes:Likes]->(root_category:Category{is_root:true}) WHERE ID(category)="+category_id.to_s
		else
			clause = " MATCH (user)-[likes:Likes]->(root_category:Category{is_root:true}) "
		end
		clause
	end

	def self.match_category category_id
		if category_id
			clause = " MATCH (user)-[likes:Likes]->(category:Category) WHERE ID(category)="+category_id.to_s+" WITH user, category "
		else
			clause = " MATCH (user)-[likes:Likes]->(category:Category) WITH user, category "
		end
		clause
	end

	def self.optional_match_category category_id
		" OPTIONAL" + User.category_clause category_id
	end

	def get_init_book_count_range
		match + " RETURN user.init_book_read_count as init_book_read_count"
	end
end