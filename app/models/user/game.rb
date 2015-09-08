class User::Game < User

	def initialize user_id
		@user_id = user_id
		@user = User.new @user_id
	end

	def get_score
		@user.match + User::Game.return_group()
	end

	def self.match
		
	end

	def save_score
		" OPTIONAL MATCH (user)-[:LastBookJudged]->(book:Book) WITH user, book "
	end

	def get_books
		match_last_book + match_judge_path + " UNWIND NODES(path) AS book " + User::Game.return_group(Book.basic_info)
	end

	def match_judge_path
		" MATCH path=(book)-[:NextJudge*9]->(last_book:Book) WITH path "
	end

	def match_last_book
		@user.match + " MATCH (user)-[:LastBookJudged]->(book:Book) WITH user, book "
	end

end