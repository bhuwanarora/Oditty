module Api
	module V0
		class StatusApi
			def self.create user_id, status_info
				if(status_info["book_id"].present?)
					Book.new(status_info["book_id"]).set_total_page_count.execute
				end
				Status.new(user_id, status_info).create
			end
		end
	end
end