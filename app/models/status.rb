class Status < Neo
	def initialize(user_id, status_info)
		@user_id 									= user_id
		@book_id 									= status_info["book_id"]
		@user 										= User.new(user_id)

		if @book_id
			@users_book 								= UsersBook.new(@book_id, user_id)
			@status_type								= Status::StatusType.new(@book_id, @user_id)
			@status_book_exchange_type					= Status::BookExchangeStatusType.new(@book_id, @user_id)
			
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
	end

	def self.match
		" MATCH (user)-[:Posted]->(status_node:StatusNode)-[:PostedContent]->(status:Status) WITH user, status_node, status "
	end

	def create
		if  @book_id.present?
			match_clause = @users_book.match
			reading_status_value = @reading_status_value ? (@status_type.create_for(@reading_status_value)  + " WITH status ") : ""
			book_exchange_status = @book_exchange_status ? @status_book_exchange_type.create_for(@book_exchange_status) : ""
		else
			match_clause = @user.match
			reading_status_value = ""
			book_exchange_status = ""
		end
		mentioned_users_ids = @mentioned_users_ids ? Status::Mention::MentionsUser.create_group(@mentioned_users_ids, @user_id) : ""
		mentioned_authors_ids = @mentioned_authors_ids ? Status::Mention::MentionsAuthor.create_group(@mentioned_authors_ids, @user_id) : ""
		hash_tags = @hash_tags ? Hashtag.create_group(@hash_tags, @user_id) : ""
		feelings = @feelings ? Status::Feeling.create_group(@feelings, @user_id) : ""
		match_clause + create_unique + " WITH status, status_node, user " + @user_feed.create("status_node") + ", status " + book_exchange_status + reading_status_value + mentioned_users_ids + mentioned_authors_ids + hash_tags + feelings + Status.return_init + Status.basic_info
	end

	def create_unique 
		clause = create_status_node + create_status 
		unless @book_id.nil?
			clause = clause + set_book_id("status_node") + set_book_id("status")
		end
		clause + Status.set_updated_at
	end

	def create_status_node
		" MERGE (user)-[posted:Posted{user_id:" + @user_id.to_s + "}]->(status_node:StatusNode{user_id:" + @user_id.to_s + ", content:\"" + @content.to_s + "\", wrapper_content:\"" + @wrapper_content.to_s + "\"}) ON CREATE SET status_node.created_at = " + Time.now.to_i.to_s + ", status_node.updated_at = " + Time.now.to_i.to_s + " ON MATCH SET status_node.updated_at = " + Time.now.to_i.to_s
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
		" MERGE (status_node)-[posted_content:PostedContent{user_id:" + @user_id.to_s + "}]->(status:Status{user_id:" + @user_id.to_s + ", content:\"" + @content.to_s + "\"}) ON CREATE SET status.created_at = " + Time.now.to_i.to_s + ", status.updated_at = " + Time.now.to_i.to_s + " ON MATCH SET status.updated_at = " + Time.now.to_i.to_s
	end

	def set_book_id node_variable="status"
		" SET " + node_variable + ".book_id = " + @book_id.to_s
	end

	def self.basic_info
		" status.user_id AS updated_by, status.content AS status, ID(status) AS id "
	end
end