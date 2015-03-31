class Status < Neo
	def initialize(user_id, status_info)
		@user_id = user_id
		@user = User.new(user_id) 
		@book_id = status_info[:book_id]  				
		@reading_status_value =  status_info[:reading_status_value] 
		@mentioned_users_ids =   status_info[:mentioned_users_ids] 
		@mentioned_authors_ids =   status_info[:mentioned_authors_ids]
		@hash_tags =   status_info[:hash_tags] 
		@content =  status_info[:content] 
		@feelings =   status_info[:feelings] 
		@book_exchange_status =  status_info[:book_exchange_status] 
	end

	def self.match
		" MATCH (user)-[:Posted]->(status_node:StatusNode)-[:PostedContent]->(status:Status) "
	end

	def create 
			@user.match + Status.merge_group(create_path) + " WITH status " + Status::StatusType.new(@book_id, @user_id).handle(@reading_status_value)  + " WITH status " + Status::Mention::MentionsUser.handle(@mentioned_users_ids, @user_id) + Status::Mention::MentionsAuthor.handle(@mentioned_authors_ids, @user_id)  + Hashtag.handle(@hash_tags, @user_id) + Status::Feeling.handle(@feelings, @user_id) + " WITH status " + Status::BookExchangeStatusType.new(@book_id, @user_id).handle(@book_exchange_status) + Status.return_init + Status.basic_info 
	end

	def create_path 
		clause = " (user)-[posted:Posted{user_id:" + @user_id.to_s + "}]->(status_node:StatusNode{user_id:" + @user_id.to_s + ",created_at:" + Time.now.to_i.to_s + ",updated_at:" + Time.now.to_i.to_s + "})-[posted_content:PostedContent{user_id:" + @user_id.to_s + "}]->(status:Status{user_id:" + @user_id.to_s + ",created_at:" + Time.now.to_i.to_s + ",updated_at:" + Time.now.to_i.to_s + ",content:\"" + @content.to_s + "\"}) "
		unless @book_id.nil?
			clause += set_book_id("status_node") + set_book_id("status")
		end
		clause 
	end

	def set_book_id node_variable
		" SET " + node_variable + ".book_id = " + @book_id.to_s
	end

	def self.basic_info
		" status.user_id AS updated_by, status.content AS status  "
	end
end