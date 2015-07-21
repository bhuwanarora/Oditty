module AuthorsHelper
	
	def self.get_authors start_id, step_size
		" MATCH(author: Author) "\
		" WHERE ID(author) >= " + start_id.to_s + " "\
		" WITH author ORDER BY ID(author) LIMIT " + (step_size).to_s + " "
	end

	def self.set_search_indices
		(end_id, start_id) = Author.get_max_min_id
		redis_key = 'duplicate_author_removal_key'
		cur_id = RedisHelper.set_up_redis redis_key, start_id
		author_batch_limit = 1000
		while cur_id <= end_id
			clause = AuthorsHelper.get_authors cur_id, author_batch_limit
			clause += UniqueIndexHelper.set_unique_indices(Constant::EntityLabel::Author)
			clause += " RETURN MAX(ID(author)) AS id"
			output = clause.execute
			if output.empty?
				break
			else
				cur_id = output[0]["id"]
				cur_id += 1
			end
			$redis[redis_key] = cur_id
		end
	end
end
