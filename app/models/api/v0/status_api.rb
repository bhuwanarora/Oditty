module Api
	module V0
		class StatusApi
			def self.create(user_id, book_id, reading_status_value, mentioned_users_ids, mentioned_authors_ids, hash_tags, content, feelings, book_exchange_status)

				(User.new(user_id).match + Neo.create_group(Status.new(user_id).create(content, book_id)) + " WITH status " + self.get_reading_status_clause(reading_status_value, book_id, user_id) + " WITH status " + self.get_mentioned_users_clauses(mentioned_users_ids, user_id) + self.get_mentioned_authors_clauses(mentioned_authors_ids, user_id)  + self.get_hashtagged_clauses(hash_tags, user_id) + self.get_feelings_clauses(feelings, user_id) + " WITH status " + self.get_book_exchange_status_clause(book_exchange_status, book_id, user_id)).execute  
			end

			def self.get_book_exchange_status_clause book_exchange_status, book_id, user_id
				case book_exchange_status
				when Constants::PlanningToBuyStatusCode
					set_book_exchange_status = Status::BookExchangeStatusType::PlanningToBuy.new(book_id, user_id).create
				when Constants::PlanningToLendStatusCode
					set_book_exchange_status = Status::BookExchangeStatusType::PlanningToLend.new(book_id, user_id).create
				when Constants::PlanningToBorrowStatusCode
					set_book_exchange_status = Status::BookExchangeStatusType::PlanningToBorrow.new(book_id, user_id).create
				end
				set_book_exchange_status
			end

			def self.get_reading_status_clause reading_status_value, book_id, user_id
				case reading_status_value
				when Constants::PlanningToReadStatusCode
					set_reading_status = Status::StatusType::PlanningToRead.create(book_id, user_id)
				when Constants::CurrentlyReadingStatusCode
					set_reading_status = Status::StatusType::CurrentlyReading.create(book_id, user_id)
				when Constants::ReadStatusCode
					set_reading_status = Status::StatusType::Read.create(book_id, user_id)
				end
				set_reading_status
			end

			def self.get_feelings_clauses feelings, user_id
				feelings_clauses = ""
				clauses = feelings.each{|feeling| feelings_clauses +=  " WITH status " + Neo.create_group(Status::Feeling.create(user_id, feeling))}
				feelings_clauses
			end

			def self.get_mentioned_users_clauses mentioned_users_ids, user_id
				mentioned_users_clauses = ""
				clauses = mentioned_users_ids.each{|mentioned_user_id| mentioned_users_clauses += Status::Mention::MentionsUser.new(mentioned_user_id).create(user_id)}
				mentioned_users_clauses
			end

			def self.get_mentioned_authors_clauses mentioned_authors_ids, user_id
				mentioned_authors_clauses = ""
				clauses = mentioned_authors_ids.each{|mentioned_author_id| mentioned_authors_clauses += Status::Mention::MentionsAuthor.new(mentioned_author_id).create(user_id)}
				mentioned_authors_clauses
			end

			def self.get_hashtagged_clauses hash_tags, user_id
				hashtagged_clauses = ""
				clauses = hash_tags.each{|hash_tag| hashtagged_clauses += " WITH status " + Neo.create_group(Hashtag.create(user_id, hash_tag))}
				hashtagged_clauses
			end
		end
	end
end