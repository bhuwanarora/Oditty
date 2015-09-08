module Api
	module V0
		class GamesApi

			def self.get_books user_id
				User::Game.new(user_id).get_books
			end

			def self.get_users skip
				User::Game.get_score_board
			end

			def self.get_score user_id
				User::Game.new(user_id).get_score
			end

			def self.save_score user_id, score
				User::Game.new(user_id).save_score(score)
			end
		end
	end
end
