class Status < Neo
	def initialize(user_id, status_info)
		@user_id 									= user_id
		@book_id 									= status_info["book_id"]
		@user 										= User.new(user_id)

		if @book_id
			@users_book 							= UsersBook.new(@book_id, user_id)
			@status_type							= Status::StatusType.new(@book_id, @user_id)
			@status_book_exchange_type				= Status::BookExchangeStatusType.new(@book_id, @user_id)
		end
		@user_feed									= User::Feed.new(user_id)
		@reading_status_value 						= status_info["reading_status_value"]
		@mentioned_users_ids 						= status_info["mentioned_users_ids"]
		@mentioned_authors_ids 						= status_info["mentioned_authors_ids"]
		@hash_tags 									= status_info["hash_tags"]
		@content 									= status_info["content"]
		@wrapper_content 							= status_info["wrapper_content"]
		@feelings 									= status_info["feelings"]
		@book_exchange_status 						= status_info["book_exchange_status"]
		@total_page_count							= status_info["total_page_count"]
		@current_page								= status_info["current_page"]
	end

	def self.match
		" MATCH (user)-[:Posted]->(status_node:StatusNode)-[:PostedContent]->(status:Status) WITH user, status_node, status "
	end

	def create
		if  @book_id.present?
			match_clause = @users_book.match
			reading_status_value = @reading_status_value ? (@status_type.create_for(@reading_status_value)  + " WITH status ") : ""
			book_exchange_status = @book_exchange_status ? @status_book_exchange_type.create_for(@book_exchange_status) : ""
			set_page_count_clause = @total_page_count ? set_book_page_count : ""
			book_feed_addition = Book::BookFeed.new(@book_id).create "status_node"
		else
			match_clause = @user.match
			reading_status_value = ""
			book_exchange_status = ""
			set_page_count_clause = ""
			book_feed_addition = " WITH user, status_node "
		end
		mentioned_users_ids = @mentioned_users_ids ? Status::Mention::MentionsUser.create_group(@mentioned_users_ids, @user_id) : ""
		mentioned_authors_ids = @mentioned_authors_ids ? Status::Mention::MentionsAuthor.create_group(@mentioned_authors_ids, @user_id) : ""
		hash_tags = @hash_tags ? Hashtag.create_group(@hash_tags, @user_id) : ""
		feelings = @feelings ? Status::Feeling.create_group(@feelings, @user_id) : ""
		if @book_id.present?
			with_clause = " WITH status, book, status_node, user "
		else
			with_clause = " WITH status, status_node, user "
		end
		match_clause + create_unique + with_clause + book_feed_addition + ", status " + @user_feed.create("status_node") + ", status " + book_exchange_status + reading_status_value + mentioned_users_ids + mentioned_authors_ids + hash_tags + feelings + set_page_count_clause + Status.return_init + Status.basic_info
	end

	def create_unique 
		clause = " CREATE UNIQUE (user)-[posted:Posted{user_id:" + @user_id.to_s + "}]->" + create_status_node + "-[posted_content:PostedContent{user_id:" + @user_id.to_s + "}]->" + create_status + " SET status.updated_at = " + Time.now.to_i.to_s + " "
		unless @book_id.nil?
			clause = clause + set_book_id("status_node") + set_book_id("status")
		end
		clause + Status.set_updated_at
	end

	def create_status_node
		" (status_node:StatusNode{user_id:" + @user_id.to_s + ", created_at:" + Time.now.to_i.to_s + ", content:\"" + @content.to_s + "\", wrapper_content:\"" + @wrapper_content.to_s + "\"}) "
	end

	def self.set_created_at
		" SET status_node.created_at = "+ Time.now.to_i.to_s + " "
	end

	def self.set_updated_at
		" SET status_node.updated_at = "+ Time.now.to_i.to_s + " "
	end

	def self.set_book_id
		" SET status_node.book_id = " + @book_id.to_s + " "
	end

	def create_status
		" (status:Status{user_id:" + @user_id.to_s + ", created_at:" + Time.now.to_i.to_s + ", content:\"" + @content.to_s + "\"}) "
	end

	def set_book_id node_variable="status"
		clause = " SET " + node_variable + ".book_id = " + @book_id.to_s
		if(@total_page_count.present?)
			clause += " SET " + node_variable + ".total_page_count = " + @total_page_count.to_s
		end
		if(@current_page.present?)
			clause += " SET " + node_variable + ".current_page = " + @current_page.to_s
		end
		clause
	end

	def self.basic_info
		" status.user_id AS updated_by, status.content AS status, ID(status_node) AS status_id "
	end

	def set_book_page_count
		clause = " OPTIONAL MATCH (status)-[:Mentions]->(book:Book) "\
			"WHERE HAS(status.total_page_count) AND ID(book) = " + @book_id.to_s + " "\
			"WITH book, COLLECT(status.total_page_count) AS page_count, COUNT(status.total_page_count) AS count, status "
		clause += "ORDER BY count DESC " + Book.limit(1) + " "
		clause += " FOREACH (ignore IN (CASE WHEN (NOT HAS(book.page_count) AND LENGTH(page_count) > 0) THEN [1] ELSE [] END )|  "
		clause += " SET book.page_count = HEAD(page_count)) "
		clause
	end
end