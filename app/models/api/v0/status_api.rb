module Api
	module V0
		class StatusApi
			def initialize(user_id, content, book_id=nil, reading_status_value=nil, mentioned_users_ids=nil, mentioned_authors_ids=nil, hash_tags=nil, feelings=nil, book_exchange_status=nil)

				@user_id = user_id
				@book_id = book_id				
				@reading_status_value = reading_status_value
				@mentioned_users_ids = mentioned_users_ids
				@mentioned_authors_ids = mentioned_authors_ids
				@hash_tags = hash_tags
				@content = content
				@feelings = feelings
				@book_exchange_status = book_exchange_status
			end
			def create
				Status.new(@user_id, @content, @book_id, @reading_status_value, @mentioned_users_ids, @mentioned_authors_ids, @hash_tags, @feelings, @book_exchange_status).create
			end
		end
	end
end