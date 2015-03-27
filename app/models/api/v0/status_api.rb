module Api
	module V0
		class StatusApi
			def self.create(user_id, book_id, reading_status_value, mentioned_users_ids, mentioned_authors_ids, hash_tags, content, feelings, book_exchange_status)
				case reading_status_value
				when Constants::PlanningToReadStatusCode
					set_reading_status = Status::StatusType::PlanningToRead.create
				when Constants::CurrentlyReadingStatusCode
					set_reading_status = Status::StatusType::CurrentlyReading.create
				when Constants::ReadStatusCode
					set_reading_status = Status::StatusType::Read.create
				end

				case book_exchange_status
				when Constants::PlanningToBuyStatusCode
					set_book_exchange_status = Status::BookExchangeStatusType::PlanningToBuy.new(book_id, user_id).create
				when Constants::PlanningToLendStatusCode
					set_book_exchange_status = Status::BookExchangeStatusType::PlanningToLend.new(book_id, user_id).create
				when Constants::PlanningToBorrowStatusCode
					set_book_exchange_status = Status::BookExchangeStatusType::PlanningToBorrow.new(book_id, user_id).create
				end
					
				mentioned_authors_clauses = ""
				mentioned_users_clauses = ""
				hashtagged_clauses = ""
				feelings_clauses = ""

				feelings.each{|feeling| feelings_clauses +=  " WITH status " + Neo.new.create_group(Status::Feeling.create(user_id, feeling))}
				hash_tags.each{|hash_tag| hashtagged_clauses += " WITH status " + Neo.new.create_group(Hashtag.create(user_id, hash_tag))}
				
				mentioned_users_ids.each{|mentioned_user_id| mentioned_users_clauses += Status::Mention::MentionsUser.create(user_id, mentioned_user_id)}
				mentioned_authors_ids.each{|mentioned_author_id| mentioned_authors_clauses += Status::Mention::MentionsAuthor.create(user_id, mentioned_author_id)}
				(User.new(user_id).match + Neo.new.create_group(Status.new(user_id, book_id).create(content)) + set_reading_status + " WITH status " + mentioned_users_clauses + mentioned_authors_clauses  + hashtagged_clauses + feelings_clauses + " WITH status " + set_book_exchange_status).execute  
			end
		end
	end
end