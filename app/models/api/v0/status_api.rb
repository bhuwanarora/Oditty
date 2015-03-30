module Api
	module V0
		class StatusApi
			def self.create user_id, status_info
				Status.new(user_id, status_info).create
			end
		end
	end
end