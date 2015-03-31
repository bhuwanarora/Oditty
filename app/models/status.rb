class Status < Neo
	def initialize(user_id, status_info)
		@user_id = user_id
		@user = User.new(user_id)
		@book_id = 3 # status_info[:book_id]				
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
			@user.match + Status.merge_group(create_path) + " WITH status " + _get_reading_status_clause + " WITH status " + _get_mentioned_users_clauses + _get_mentioned_authors_clauses  + _get_hashtagged_clauses + _get_feelings_clauses + " WITH status " + _get_book_exchange_status_clause  + Status.return_init + Status.basic_info 
	end

	def create_path 
		create_clause = " (user)-[posted:Posted{user_id:" + @user_id.to_s + "}]->(status_node:StatusNode{user_id:" + @user_id.to_s + ",created_at:" + Time.now.to_i.to_s + ",updated_at:" + Time.now.to_i.to_s + "})-[posted_content:PostedContent{user_id:" + @user_id.to_s + "}]->(status:Status{user_id:" + @user_id.to_s + ",created_at:" + Time.now.to_i.to_s + ",updated_at:" + Time.now.to_i.to_s + ",content:\"" + @content.to_s + "\"}) "
		unless @book_id.nil?
			create_clause += set_book_id("status_node") + set_book_id("status")
		end
		create_clause 
	end

	def set_book_id node_variable
		" SET " + node_variable + ".book_id = " + @book_id.to_s
	end

	def self.basic_info
		" status.user_id AS updated_by, status.content AS status  "
	end

	private

	def _get_book_exchange_status_clause 
		unless @book_exchange_status.nil?
			
			case @book_exchange_status
			when Constants::PlanningToBuyStatusCode
				clause = Status::BookExchangeStatusType::PlanningToBuy.new(@book_id, @user_id).create
			when Constants::PlanningToLendStatusCode
				clause = Status::BookExchangeStatusType::PlanningToLend.new(@book_id, @user_id).create
			when Constants::PlanningToBorrowStatusCode
				clause = Status::BookExchangeStatusType::PlanningToBorrow.new(@book_id, @user_id).create
			end
		else
			clause = ""
		end
		clause
	end

	def _get_reading_status_clause
		clause = ""
		unless @reading_status_value.nil?
			case @reading_status_value
			when Constants::PlanningToReadStatusCode
				clause = Status::StatusType::PlanningToRead.new(@book_id, @user_id).create
			when Constants::CurrentlyReadingStatusCode
				clause = Status::StatusType::CurrentlyReading.new(@book_id, @user_id).create
			when Constants::ReadStatusCode
				clause = Status::StatusType::Read.new(@book_id, @user_id).create
			end
		end 
		clause
	end

	def _get_feelings_clauses 
		clause = ""
		unless @feelings.nil?
			@feelings.each{|feeling| clause +=  " WITH status " + Status::Feeling.new(feeling, @user_id).create}
			clause
		end
		clause
	end

	def _get_mentioned_users_clauses
		clause = ""
		unless @mentioned_users_ids.nil?
			@mentioned_users_ids.each{|mentioned_user_id| clause += Status::Mention::MentionsUser.new(mentioned_user_id, @user_id).create}
		end
		clause
	end

	def _get_mentioned_authors_clauses 
		clause = ""
		unless @mentioned_authors_ids.nil?
			@mentioned_authors_ids.each{|mentioned_author_id| clause += Status::Mention::MentionsAuthor.new(mentioned_author_id, @user_id).create}
		end
		clause
	end

	def _get_hashtagged_clauses 
		clause = ""
		unless @hash_tags.nil?
			@hash_tags.each{|hash_tag| clause += " WITH status " + Hashtag.new(hash_tag, @user_id).create}
		end
		clause
	end
end