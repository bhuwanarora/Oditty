module RedisHelper::Author

	def self.delete_basic_info params
		key = RedisHelper::Author.get_key_basic_info params[:id]
		$redis.del key
	end

	def self.set_basic_info params
		key = RedisHelper::Author.get_key_basic_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_basic_info params
		key = RedisHelper::Author.get_key_basic_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_details params
		key = RedisHelper::Author.get_key_details params[:id], params[:user_id]
		$redis.del key
	end

	def self.set_details params
		key = RedisHelper::Author.get_key_details params[:id], params[:user_id]
		$redis.set(key, params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_details params
		key = RedisHelper::Author.get_key_details params[:id], params[:user_id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.clear_details params
		author_id 	= params[:id]
		user_id 	= params[:user_id]
		if user_id.present?
			RedisHelper::Author.delete_details params
		else
			key = RedisHelper::Author.get_key_details author_id, user_id
			RedisHelper.clear key
		end
	end

	def self.delete_interview_details params
		key = RedisHelper::Author.get_key_interview_details params[:id]
		$redis.del key
	end

	def self.set_interview_details params
		key = RedisHelper::Author.get_key_interview_details params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_interview_details params
		key = RedisHelper::Author.get_key_interview_details params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_author_books params
		key = RedisHelper::Author.get_key_author_books params[:id], params[:user_id], params[:skip_count]
		$redis.del key
	end

	def self.set_author_books params
		key = RedisHelper::Author.get_key_author_books params[:id], params[:user_id], params[:skip_count]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_author_books params
		key = RedisHelper::Author.get_key_author_books params[:id], params[:user_id], params[:skip_count]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_popular params
		key = RedisHelper::Author.get_key_popular params[:id]
		$redis.del key
	end

	def self.set_popular params
		key = RedisHelper::Author.get_key_popular params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_popular params
		key = RedisHelper::Author.get_key_popular params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_interviewed params
		key = RedisHelper::Author.get_key_interviewed params[:id]
		$redis.del key
	end

	def self.set_interviewed params
		key = RedisHelper::Author.get_key_interviewed params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_interviewed params
		key = RedisHelper::Author.get_key_interviewed params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	private
	def self.get_key_basic_info id
		'BAI' + id.to_s
	end

	def self.get_key_interview_details id
		"GID" + id.to_s
	end

	def self.get_key_interviewed skip_count
		"author/I" + skip_count.to_s
	end

	def self.get_key_author_books id, user_id, skip_count
		"author/AB" + id.to_s + ":" + user_id.to_s + ":" + skip_count.to_s
	end

	def self.get_key_popular skip_count
		"author/P" + skip_count.to_s
	end

	def self.get_key_details id, user_id
		if user_id.nil?
			"AuthorUserD" + id.to_s
		else
			"AuthorUserD" + id.to_s + "/" + user_id.to_s
		end
	end

	
end