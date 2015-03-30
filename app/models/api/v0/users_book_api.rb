module Api
	module V0
		class UsersBookApi
			def self.endorse_book book_id, user_id
				UsersBook::Endorse.new(book_id, user_id).add
			end

			def self.remove_endorse book_id, user_id
				UsersBook::Endorse.new(book_id, user_id).remove
			end
		end
	end
end