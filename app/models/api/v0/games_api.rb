module Api
	module V0
		class GamesApi

			def self.get_books user_id
				User::Game.new(user_id).get_books
			end

			def self.get_users
			end

			def self.get_score user_id
				User::Game.new(user_id).get_score.execute[0]
			end

			def self.save_score
			end
		end
	end
end
