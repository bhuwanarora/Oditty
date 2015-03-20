class Bookmark < Neo
	Read 									= "Read"
	IntendingToRead 						= "IntendingToRead"
	DidntFeelLikeReadingItAfterAPoint 		= "DidntFeelLikeReadingItAfterAPoint"
	PretendIHaveRead 						= "PretendIHaveRead"
	SavingForWhenIHaveMoreTime 				= "SavingForWhenIHaveMoreTime"
	WillNeverRead 							= "WillNeverRead"
	PurelyForShow 							= "PurelyForShow"
	ReadButCantRememberASingleThingAboutIt 	= "ReadButCantRememberASingleThingAboutIt"
	WishIHadntRead 							= "WishIHadntRead"
	CurrentlyReading 						= "CurrentlyReading"
	HaveLeftAMarkOnMe 						= "HaveLeftAMarkOnMe"
	NotWorthReading 						= "NotWorthReading"
	FromFacebook 							= "FromFacebook"
	PlanToBuy 								= "PlanToBuy"
	IOwnthis 								= "IOwnthis"
	Visited 								= "Visited"

	def initialize(user_id, id, bookmark_key, add=true, type)
		@user_id = user_id
		@id = id
		@bookmark_key = bookmark_key

		@neo = Neography::Rest.new
		case bookmark_key
		when Read
			clause = self.read
		when IntendingToRead
			clause = self.intending_to_read
		when DidntFeelLikeReadingItAfterAPoint
			clause = self.didnt_feel_like_reading_it_after_a_point
		when PretendIHaveRead
			clause = self.pretend_i_have_read
		when SavingForWhenIHaveMoreTime
			clause = self.saving_for_when_i_have_more_time
		when WillNeverRead
			clause = self.will_never_read
		when PurelyForShow
			clause = self.purely_for_show
		when ReadButCantRememberASingleThingAboutIt
			clause = self.read_but_cant_remember_a_single_thing_about_it
		when WishIHadntRead
			clause = self.wish_i_hadnt_read
		when CurrentlyReading
			clause = self.currently_reading
		when HaveLeftAMarkOnMe
			clause = self.have_left_a_mark_on_me
		when NotWorthReading
			clause = self.not_worth_reading
		when FromFacebook
			clause = self.from_facebook
		when PlanToBuy
			clause = self.plan_to_buy
		when IOwnthis
			clause = self.i_own_this
		when Visited
			clause = self.visited
		end

		clause = (add ? self.bookmark_book : self.remove_bookmark) + clause
		self.execute clause
	end

	def self.add
		bookmark_clause = _match_user_and_book+" CREATE UNIQUE (u)-[lr:Labelled]->(l:Label{name: \""+@bookmark_key.strip.upcase+"\"}), (l)-[:BookmarkedOn]->(m: BookmarkNode{label:\""+@bookmark_key.strip.upcase+"\", id:"+@id.to_s+", user_id:"+@user_id.to_s+"}), (m)-[:BookmarkAction]->(b) SET m.title = b.title,  m.author = b.author_name, m.name = u.name, m.email=u.email, m.isbn = b.isbn, m.timestamp = "+Time.now.to_i.to_s+", m.thumb = CASE WHEN u.thumb IS NULL THEN '' ELSE u.thumb END WITH u, b, m, l, lr "

		feednext_clause = _feednext_clause(@user_id)+", l, lr "

		bookfeed_next_clause = _bookfeed_clause+", l, lr "

		existing_ego_clause = _existing_ego_clause+", l, lr "

		ego_clause = _ego_clause + ", l, lr "


		set_clause = "SET b.bookmark_count = CASE WHEN b.bookmark_count IS NULL THEN 1 ELSE toInt(b.bookmark_count) + 1 END, u.bookmark_count = CASE WHEN u.bookmark_count IS NULL THEN 1 ELSE toInt(u.bookmark_count) + 1 END, l.bookmark_count = CASE WHEN l.bookmark_count IS NULL THEN 1 ELSE toInt(l.bookmark_count) + 1 END, lr.bookmark_count = CASE WHEN lr.bookmark_count IS NULL THEN 1 ELSE toInt(lr.bookmark_count) + 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN "+Constants::BookmarkPoints.to_s+" ELSE toInt(u.total_count) + "+Constants::BookmarkPoints.to_s+" END"

		clause = bookmark_clause + feednext_clause + bookfeed_next_clause + existing_ego_clause + ego_clause + set_clause
		puts "BOOK BOOKMARKED".green
		#update bookmark cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookmark cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.remove
		remove_bookmark_node_clause = "MATCH (u:User), (b:Book), (l:Label) WHERE ID(u)="+@user_id.to_s+" AND ID(b)="+@id.to_s+" AND l.name = \""+@bookmark_key.strip.upcase+"\" WITH u, b, l MATCH (u)-[lr:Labelled]->(l)-[r1:BookmarkedOn]->(m:BookmarkNode)-[r3:BookmarkAction]->(b) DELETE r1, r3 WITH u, b, lr, l, m "
		
		feednext_clause = _delete_feed_clause(@user_id) + ", lr, l "

		bookfeed_next_clause = _delete_book_clause(@user_id) + ", lr, l "

		delete_node = "DELETE m WITH u, b, l, lr "

		set_clause = "SET b.bookmark_count = CASE WHEN b.bookmark_count IS NULL THEN 0 ELSE toInt(b.bookmark_count) - 1 END, u.bookmark_count = CASE WHEN u.bookmark_count IS NULL THEN 0 ELSE toInt(u.bookmark_count) - 1 END, l.bookmark_count = CASE WHEN l.bookmark_count IS NULL THEN 0 ELSE toInt(l.bookmark_count) - 1 END, lr.bookmark_count = CASE WHEN lr.bookmark_count IS NULL THEN 0 ELSE toInt(lr.bookmark_count) - 1 END, u.total_count = CASE WHEN u.total_count IS NULL THEN 0 ELSE toInt(u.total_count) - "+Constants::BookmarkPoints.to_s+" END"

		clause = remove_bookmark_node_clause + feednext_clause + bookfeed_next_clause + delete_node + set_clause

		puts "REMOVE BOOKMARKED".green
		
		#ego feed update
		#update bookmark cache for the book
		#update popularity index for the book
		#update popularity index for the author

		#update bookmark cache for the user
		#update bookworm index for the user

		#update news feed for the book
		#update news feed for the user
	end

	def self.read

	end

	def self.intending_to_read

	end

	def self.didnt_feel_like_reading_it_after_a_point

	end

	def self.pretend_i_have_read

	end

	def self.saving_for_when_i_have_more_time

	end

	def self.will_never_read

	end

	def self.purely_for_show

	end

	def self.read_but_cant_remember_a_single_thing_about_it

	end

	def self.wish_i_hadnt_read

	end

	def self.currently_reading

	end

	def self.have_left_a_mark_on_me
		match_user_to_books_clause = " WITH u, l, m, b OPTIONAL MATCH (u)-->(l)-->(m)-->(b) WITH user, COUNT(DISTINCT book) as total_book_count MATCH (user)-->(label)-->(bookmark)-->(book)-[:FromCategory]->()-[:HasRoot*0..1]->(root_category{is_root:true}) WITH total_book_count, user, root_category "
		match_user_to_category_clause = "OPTIONAL MATCH  (user)-[likes_category:Likes]->(root_category) WITH user, likes_category, root_category, total_book_count MATCH (user)-[likes_category:Likes]->(root_category) "
		set_likeability_index_clause = "SET likes_category.likeability_index = TOFLOAT(likes_category.weight*1.0/total_book_count)"
		clause = match_user_to_books_clause + match_user_to_category_clause + set_likeability_index_clause							
		
		set_favourite_clause = ", likes_category.favourite = true"
		# case @bookmark_key

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

	def self.not_worth_reading

	end

	def self.from_facebook

	end

	def self.plan_to_buy

	end

	def self.i_own_this

	end

	def self.visited

	end

	private

	def _match_user_and_book
		"MATCH (user:User), (book:Book) WHERE ID(user) = " + @user_id.to_s + " AND ID(book) = " + @id.to_s + " "
	end

	def _feednext_clause(without_book=false)
		find_old_feed = "MATCH (user)-[old:FeedNext]->(old_feed) "
		create_new_feed = "CREATE UNIQUE (user)-[:FeedNext{user_id:"+user_id.to_s+"}]->(bookmark)-[:FeedNext{user_id:"+user_id.to_s+"}]->(old_feed) "
		if without_book
			delete_old_feed = "DELETE old WITH user, bookmark "
		else
			delete_old_feed = "DELETE old WITH user, book, bookmark "
		end
		clause = find_old_feed + create_new_feed + delete_old_feed
		clause
	end

	def _bookfeed_clause
		find_old_book_feed = "MATCH (book)-[old:BookFeed]->(old_feed) "
		create_new_book_feed = "CREATE UNIQUE (book)-[:BookFeed{user_id:" + @user_id.to_s + "}]->(bookmark)-[:BookFeed{user_id:" + @user_id.to_s + "}]->(old_feed) "
		delete_old_book_feed = "DELETE old WITH user, book, bookmark "
		clause = find_old_book_feed + create_new_book_feed + delete_old_book_feed
		clause
	end

	def _existing_ego_clause(without_book=false)
		find_friends = "OPTIONAL MATCH (user)<-[:Follow]-(friend:User) "
		find_me_in_friends_ego_chain = "OPTIONAL MATCH (x1)-[r1:Ego{user_id:ID(friend)}]->(user)-[r2:Ego{user_id:ID(friend)}]->(x2) "
		remove_me_from_friends_ego_chain = "FOREACH (s IN CASE WHEN r1 IS NULL THEN [] ELSE [r1] END | FOREACH (t IN CASE WHEN r2 IS NULL THEN [] ELSE [r2] END | CREATE (x1)-[:Ego{user_id:ID(friend)}]->(x2) DELETE s, t)) "
		if without_book
			with_clause = "WITH user, friend "
		else
			with_clause = "WITH user, book, friend "
		end
		clause = find_friends + find_me_in_friends_ego_chain + remove_me_from_friends_ego_chain + with_clause
		clause
	end

	def _ego_clause(without_book=false)
		friends_old_ego_clause = "OPTIONAL MATCH (friend)-[old:Ego{user_id:ID(friend)}]->(old_ego) "
		create_new_and_delete_old_ego_clause = "FOREACH(p IN CASE WHEN old_ego IS NULL THEN [] ELSE [old_ego] END | FOREACH (q IN CASE WHEN friend IS NULL THEN [] ELSE [f] END | CREATE (q)-[:Ego{user_id:ID(q)}]->(user)-[:Ego{user_id:ID(q)}]->(p) DELETE old)) "
		if without_book
			with_clause = "WITH DISTINCT user "
		else
			with_clause = "WITH DISTINCT user, book "
		end
		clause = friends_old_ego_clause + create_new_and_delete_old_ego_clause + with_clause
		clause
	end
end