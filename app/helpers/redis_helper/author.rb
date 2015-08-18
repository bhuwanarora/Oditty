module RedisHelper::Author

	def self.delete_basic_author_info params
		key = RedisHelper.get_key_basic_author_info params[:id]
		$redis.del key
	end

	def self.set_basic_author_info params
		key = RedisHelper.get_key_basic_author_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_basic_author_info params
		key = RedisHelper.get_key_basic_author_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_interview_details params
		key = RedisHelper.get_key_interview_details params[:id]
		$redis.del key
	end

	def self.set_interview_details params
		key = RedisHelper.get_key_interview_details params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_interview_details params
		key = RedisHelper.get_key_interview_details params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	private
	def self.get_key_basic_author_info id
		'BAI' + id.to_s
	end

	def self.get_key_interview_details id
		"GID" + id.to_s
	end

	
end