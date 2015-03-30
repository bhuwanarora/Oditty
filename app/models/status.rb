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
			@user.match + Neo.merge_group(create_path) + " WITH status " + _get_reading_status_clause + " WITH status " + _get_mentioned_users_clauses + _get_mentioned_authors_clauses  + _get_hashtagged_clauses + _get_feelings_clauses + " WITH status " + _get_book_exchange_status_clause  + Neo.return_init + " status "
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


	def _get_book_exchange_status_clause 
		unless @book_exchange_status.nil?
			
			case @book_exchange_status
			when Constants::PlanningToBuyStatusCode
				set_book_exchange_status = Status::BookExchangeStatusType::PlanningToBuy.new(@book_id, @user_id).create
			when Constants::PlanningToLendStatusCode
				set_book_exchange_status = Status::BookExchangeStatusType::PlanningToLend.new(@book_id, @user_id).create
			when Constants::PlanningToBorrowStatusCode
				set_book_exchange_status = Status::BookExchangeStatusType::PlanningToBorrow.new(@book_id, @user_id).create
			end
		else
			set_book_exchange_status = ""
		end
		set_book_exchange_status
	end

	def _get_reading_status_clause
		set_reading_status = ""
		unless @reading_status_value.nil?
			case @reading_status_value
			when Constants::PlanningToReadStatusCode
				set_reading_status = Status::StatusType::PlanningToRead.new(@book_id, @user_id).create
			when Constants::CurrentlyReadingStatusCode
				set_reading_status = Status::StatusType::CurrentlyReading.new(@book_id, @user_id).create
			when Constants::ReadStatusCode
				set_reading_status = Status::StatusType::Read.new(@book_id, @user_id).create
			end
		end 
		set_reading_status
	end

	def _get_feelings_clauses 
		feelings_clauses = ""
		unless @feelings.nil?
			@feelings.each{|feeling| feelings_clauses +=  " WITH status " + Status::Feeling.new(feeling, @user_id).create}
			feelings_clauses
		end
		feelings_clauses
	end

	def _get_mentioned_users_clauses
		mentioned_users_clauses = ""
		unless @mentioned_users_ids.nil?
			@mentioned_users_ids.each{|mentioned_user_id| mentioned_users_clauses += Status::Mention::MentionsUser.new(mentioned_user_id, @user_id).create}
		end
		mentioned_users_clauses
	end

	def _get_mentioned_authors_clauses 
		mentioned_authors_clauses = ""
		unless @mentioned_authors_ids.nil?
			@mentioned_authors_ids.each{|mentioned_author_id| mentioned_authors_clauses += Status::Mention::MentionsAuthor.new(mentioned_author_id, @user_id).create}
		end
		mentioned_authors_clauses
	end

	def _get_hashtagged_clauses 
		hashtagged_clauses = ""
		unless @hash_tags.nil?
			@hash_tags.each{|hash_tag| hashtagged_clauses += " WITH status " + Hashtag.new(hash_tag, @user_id).create}
		end
		hashtagged_clauses
	end
end