module GameHelper
BooksBatchSize = 10
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

	def self.get_limits start_goodness_index
		goodness_book_limit_hash =
		{
			0 => 100,
			1 => 100,
			2 => 100,
			3 => 100,
			4 => 100,
			5 => 100,
			6 => 200,
			7 => 200,
			8 => 200,
			9 => 200
		}
		goodness_book_limit_hash[start_goodness_index]
	end

	def self.get_book_ids
		bucket_width = 1
		clause = ""
		clause_array = []

		(0..9).each do |start_goodness_index|
			limit = GameHelper.get_limits(start_goodness_index)
			clause = GameHelper.get_books_in_goodness_range(start_goodness_index, start_goodness_index + bucket_width, limit)
			clause += " RETURN ID(book) AS id "
			clause_array << clause
		end
		id_list = clause_array[0..7].join(" UNION ").execute.map { |elem| (elem["id"])  }
		id_list_0_7 = id_list.shuffle
		id_list_8_9 = clause_array[8..9].join(" UNION ").execute.map{|elem| (elem["id"])}
		output_list = GameHelper.sprinkle_popular_books( id_list_0_7, id_list_8_9)
		output_list
	end

	def self.create_book_linked_list_all_types
		GameHelper.clean_up_history
		id_list = GameHelper.get_book_ids
		GameHelper.create_book_linked_list_from_id id_list
		GameHelper.create_last_book_judged.execute
	end

	def self.clean_up_history
		RedisHelper::Game.clean_up
		all_cleaned_up = false
		while !all_cleaned_up
			output1 = (GameHelper.clean_up_user).execute
			output2 = (GameHelper.clean_up_user_links).execute
			output3 = (GameHelper.clean_up_book_links).execute
			all_cleaned_up = output1.empty? && output2.empty? && output3.empty?
		end
	end

	def self.create_book_linked_list_from_id id_list
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
	end

	def self.create_last_book_judged
		User.match + User::Game.match_initial_book_by_id + ", user MERGE (user)-[:LastBookJudged]->(book) "
	end

	def self.find_non_image_books_to_file filename = 'log/image_less_books.txt'
		clause = GameHelper.match_books + "RETURN ID(book) AS id "
		id_list = clause.execute
		no_image_list = []
		id_list.each do |id|
			if !BookHelper.has_image_on_S3(id["id"])
				no_image_list << id
			end
		end
		GenericHelper.write_array_to_file(no_image_list, filename)
	end

	def self.match_books
		" MATCH (book:Book) "\
		" WHERE (book)-[:NextJudge]-() "\
		" WITH DISTINCT book "
	end

	private

	def self.clean_up_user
		" MATCH (user:User) "\
		" WHERE HAS(user.score) "\
		" WITH user LIMIT 50 "\
		" REMOVE user.rank, user.score, user.played_games_count "\
		" RETURN ID(user) AS id "
	end

	def self.clean_up_user_links
		" MATCH (user:User)-[last_book_judged:LastBookJudged]->(:Book) "\
		" WITH last_book_judged, ID(user) AS id LIMIT 50 "\
		" DELETE last_book_judged "\
		" RETURN id "
	end

	def self.clean_up_book_links
		" MATCH (book:Book)-[next_judge:NextJudge]->(:Book) "\
		" WITH next_judge, ID(book) AS id LIMIT 50 "\
		" DELETE next_judge "\
		" RETURN id "
	end

	def self.sprinkle_popular_books books_0_7, books8_9
		output_id_list = []
		popular_books_index = 0
		index_1_7 = books_0_7.length / BooksBatchSize
		(0..index_1_7).each do |index|
			if popular_books_index <= books8_9.length - 1
				famous_books_count = 1 + rand(3)
				left_famous_books_count = books8_9.length - popular_books_index
				famous_books_count = [left_famous_books_count, famous_books_count].min
			else
				famous_books_count = 0
			end

			if famous_books_count > 0
				famous_books_ids = books8_9[popular_books_index..(popular_books_index + famous_books_count - 1)]
				popular_books_index += famous_books_count
			else
				famous_books_ids = []
			end
			other_books_count = BooksBatchSize - famous_books_count
			left_other_books_count = books_0_7.length - BooksBatchSize*index
			other_books_count = [other_books_count, left_other_books_count].min
			other_book_ids = books_0_7[BooksBatchSize*index..(BooksBatchSize*index + other_books_count - 1)]
			book_ids = other_book_ids + famous_books_ids
			book_ids = book_ids.shuffle
			output_id_list += book_ids
		end
		output_id_list
	end


end