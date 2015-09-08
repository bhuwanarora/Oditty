module GameHelper

	def self.create_book_linked_list
		clause = "MATCH (b:Book) "\
			" WHERE b.goodness_index > 7 AND b.isbn IS NOT NULL "\
			" WITH COLLECT(b) AS p "\
			" FOREACH(i in RANGE(0, length(p)-2) | "\
				" FOREACH(p1 in [p[i]] |  "\
					" FOREACH(p2 in [p[i+1]] |  "\
						" CREATE UNIQUE (p1)-[:NextJudge]->(p2)))) "
		clause.execute
	end

	def self.get_books_in_goodness_range start_goodness_index, end_goodness_index, limit = 100
		" MATCH (book:Book) "\
		" WHERE HAS (book.isbn) AND "\
		" book.goodness_index > " + start_goodness_index.to_s + " "\
		" AND book.goodness_index <= " + end_goodness_index.to_s + " "\
		" WITH book LIMIT " + limit.to_s + " "
	end

	def self.get_book_ids
		bucket_width = 1
		clause = ""
		clause_array = []
		(0..9).each do |start_goodness_index|
			clause = GameHelper.get_books_in_goodness_range(start_goodness_index, start_goodness_index + bucket_width)
			clause += " RETURN ID(book) AS id "
			clause_array << clause
		end
		clause = clause_array.join(" UNION ")
		output = clause.execute
		id_list = output.map{|elem| (elem["id"])}
		id_list = id_list.shuffle
		id_list
	end

	def self.create_book_linked_list_all_types
		id_list = GameHelper.get_book_ids
		GameHelper.create_book_linked_list_from_id id_list
	end

	def self.clean_up_history
		RedisHelper::Game.clean_up
		clause  = GameHelper.clean_up_user
		clause += GameHelper.clean_up_user_links
		clause += GameHelper.clean_up_book_links
		clause.execute
	end

	def self.create_book_linked_list_from_id id_list
		GameHelper.clean_up_history
		(0..(id_list.length - 2)).each do |index|
			match_param =
			{
				'book1' => id_list[index],
				'book2' => id_list[index + 1]
			}
			clause = Neo.match_multiple_nodes_by_id(match_param)
			clause += " CREATE UNIQUE (book1)-[:NextJudge]->(book2) "
			clause.execute
		end
		GameHelper.create_last_book_judged.execute
	end

	def self.create_last_book_judged
		User.match + User::Game.match_initial_book + " MERGE (user)-[:LastBookJudged]->(book) "
	end

	private

	def self.clean_up_user
		" MATCH (user:User) "\
		" REMOVE user.rank, user.score, user.played_games_count "\
		" WITH user "
	end

	def self.clean_up_user_links
		" MATCH (user:User)-[last_book_judged:LastBookJudged]->() "\
		" DELETE last_book_judged "\
		" WITH user "
	end

	def self.clean_up_book_links
		" MATCH (book:Book)-[next_judge:NextJudge]->() "\
		" DELETE next_judge "
	end


end