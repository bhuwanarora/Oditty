class Status < Neo
	def initialize(user_id, status_info)
		@user_id 									= user_id
		@book_id 									= status_info["book_id"]
		@users_book 								= UsersBook.new(@book_id, user_id)
		@status_type								= Status::StatusType.new(@book_id, @user_id)
		@status_book_exchange_type					= Status::BookExchangeStatusType.new(@book_id, @user_id)
		@user_feed									= User::Feed.new(user_id)
		@reading_status_value 						= status_info["reading_status_value"]
		@mentioned_users_ids 						= status_info["mentioned_users_ids"]
		@mentioned_authors_ids 						= status_info["mentioned_authors_ids"]
		@hash_tags 									= status_info["hash_tags"]
		@content 									= status_info["content"]
		@feelings 									= status_info["feelings"]
		@book_exchange_status 						= status_info["book_exchange_status"]
	end
	

	def self.match
		" MATCH (user)-[:Posted]->(status_node:StatusNode)-[:PostedContent]->(status:Status) "
	end

	def create 
		@users_book.match + create_unique + " WITH status, status_node, user " + @user_feed.create("status_node") + ", status "+ @status_book_exchange_type.create_for(@book_exchange_status) + @status_type.create_for(@reading_status_value)  + " WITH status " + Status::Mention::MentionsUser.create_group(@mentioned_users_ids, @user_id) + Status::Mention::MentionsAuthor.create_group(@mentioned_authors_ids, @user_id)  + Hashtag.create_group(@hash_tags, @user_id) + Status::Feeling.create_group(@feelings, @user_id) + Status.return_init + Status.basic_info
	end

	def create_unique 
		clause = " CREATE UNIQUE (user)-[posted:Posted{user_id:" + @user_id.to_s + "}]->" + create_status_node + "-[posted_content:PostedContent{user_id:" + @user_id.to_s + "}]->" + create_status + " SET status.updated_at = " + Time.now.to_i.to_s + " "
		unless @book_id.nil?
			clause += set_book_id("status_node") + set_book_id("status")
		end
		clause 
	end

	def create_status_node
		if @book_id.present?
			book_data = ", title: book.title, isbn: book.isbn "
		else
			book_data = ""
		end
		" (status_node:StatusNode{user_id:" + @user_id.to_s + ", created_at:" + Time.now.to_i.to_s + ", updated_at:" + Time.now.to_i.to_s + ", content:\"" + @content.to_s + "\""+book_data+"}) "
	end

	def create_status
		" (status:Status{user_id:" + @user_id.to_s + ", created_at:" + Time.now.to_i.to_s + ", content:\"" + @content.to_s + "\"}) "
	end

	def set_book_id node_variable="status"
		" SET " + node_variable + ".book_id = " + @book_id.to_s
	end

	def self.basic_info
		" status.user_id AS updated_by, status.content AS status  "
	end
end