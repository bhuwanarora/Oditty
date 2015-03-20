class User < Neo

	def initialize user_id, skip_count=0
		# @limit = Constants::BookCountShownOnSignup
		@user_id = user_id
		# @skip_count = skip_count
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

	def self.label_clause
		"OPTIONAL MATCH (user)-[:Labelled]->(user_label:Label) "
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
		match_clause = "MATCH (u)-[r]->(n:Notification) "
		return_clause = "RETURN n, ID(n)"
		clause = _match_user(@user_id) + match_clause + return_clause
		clause
	end

	def get_bookmark_labels
		clause = _match_user(@user_id)+" OPTIONAL MATCH (u)-[:Labelled]->(bm:Label) RETURN bm.name, ID(bm)"
		clause
	end

	def get_books_bookmarked(skip_count=0)
		clause = _match_user(@user_id)+" WITH u MATCH (u)-[:Labelled]->(l:Label)-[:BookmarkedOn]->(z:BookmarkNode)-[:BookmarkAction]->(b:Book) WHERE z.user_id = "+@user_id.to_s+" RETURN b.isbn as isbn, ID(b), COLLECT(l.name) as labels SKIP "+skip_count.to_s+" LIMIT 10"
		clause
	end

	def approve_thumb_request(status, id)
		clause = "MATCH (u:User)-[r1:DataEdit]->(t:ThumbRequest)-[r2:DataEditRequest]->(b:Book) WHERE ID(t)="+id.to_s+" SET t.status = "+status.to_s+", b.external_thumb = CASE WHEN "+status.to_s+" = 1 THEN t.url ELSE null END"
		clause
	end

	def match_clause
		" MATCH (user:User) WHERE ID(user) = " + @user_id.to_s + " WITH user "
	end

	def self.root_category_clause
		" MATCH (user)-[likes:Likes]->(root_category:Category{is_root:true}) "
	end

	def get_init_book_count_range
		" MATCH (user:User) WHERE ID(user) = " + @user_id.to_s + " RETURN user.init_book_read_count as init_book_read_count"
	end
end