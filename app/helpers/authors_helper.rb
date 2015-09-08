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
			clause += UniqueSearchIndexHelper.set_unique_indices(Constant::EntityLabel::Author)
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

	def self.parse_log_line line
		output = {}
		splitted_line = line.split(/[ ,:]/)
		splitted_line.each_with_index do |line_fragment,index|
			if line_fragment == 'original_id'
				output[:original_id]  = splitted_line[index + 1]
			elsif line_fragment == 'duplicate_id'
				output[:duplicate_id] = splitted_line[index + 1]
			end
		end
		output
	end

	def self.handle_duplicate_removal_log_line line
		id_hash = AuthorsHelper.parse_log_line line
		if id_hash[:original_id].present? && id_hash[:duplicate_id].present?
			command = Rails.application.config.search_service_url + "/api/v0/remove?id=" + id_hash[:duplicate_id].to_s + "&type=Authors"
			puts command.red
			response = Net::HTTP.get(URI.parse(command))
			puts response.green
		end
	end

	def self.handle_duplicate_removal_log_file filename = (Rails.root.to_s + "/log/dup_author_regex.log")
		File.open(filename).each do |line|
			AuthorsHelper.handle_duplicate_removal_log_line line
		end
	end

end
