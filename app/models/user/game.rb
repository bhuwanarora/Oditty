class User::Game < User

	def get_score
		match + User::Game.return_group(User::Game.score_info)
	end

	def self.score_info
		" user.rank AS ranking, user.score AS score, user.played_games_count AS games "
	end

	def self.score_board_info
		User::Game.score_info + " user.first_name AS name, user.thumb AS image_url "
	end


	def self.match_top_rankers skip
		User.match +
		", CASE(WHEN HAS(user.rank) THEN user.rank ELSE 100000 END) AS rank " +
		User::Game.order_by_top + User::Game.skip(skip)
	end

	def self.increment_last_book_judged
		User::Game.match_last_book + " "\
		" DELETE last_book_judged "\
		" WITH book, user "\
		"" + User::Game.match_judge_path + " "\
		" WITH DISTINCT LAST(NODES(path)) AS last_book, user "\
		"" + User::Game.create_last_book + " "
	end

	def save_score score
		match + 
		"" + User::Game.increment_last_book_judged + " " +
		"" + User::Game.increment_games_played_count + " " +
		" SET user.score=" + User::Game.save_score_string(score) + " "
	end

	def get_books
		match_last_book +
		User::Game.match_judge_path +
		" UNWIND NODES(path) AS book " +
		" WITH book SKIP 1 " +
		User::Game.return_group(Book.basic_info)
	end

	def self.match_judge_path path_length = 10
		" MATCH path=(book)-[:NextJudge*" + path_length.to_s + "]->(last_book:Book) WITH path, user "
	end

	def self.create_last_book
		" MERGE (user)-[last_book_judged:LastBookJudged]->(last_book) "\
		" WITH user, last_book, last_book_judged "
	end

	def match_last_book
		match +  User::Game.match_last_book + " WITH user, book "
	end

	def self.match_last_book
		" MATCH (user)-[last_book_judged:LastBookJudged]->(book:Book) "
	end

	def self.get_score_board skip
		User::Game.match_top_rankers(skip) + User::Game.return_group(User::Game.score_board_info)
	end

	def self.increment_games_played_count
		" SET user.played_games_count = " + User::Game.increment_games_played_string
	end

private
	def self.order_by_top
		" ORDER BY rank "
	end

	def self.save_score_string score
		" (CASE WHEN HAS(user.score) THEN (user.score + " + score.to_s + ") ELSE " + score.to_s + " END ) "
	end

	def self.increment_games_played_string
		" (CASE WHEN HAS(user.played_games_count) THEN (user.played_games_count + 1) ELSE 1 END) "
	end

end