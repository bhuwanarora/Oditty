module RedisHelper::Session
	def self.delete_session params
		key = RedisHelper::Author.get_key_session params[:id]
		$redis.del key
	end

	def self.set_session params
		key = RedisHelper::Author.get_key_session params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::DayExpiry)
	end

	def self.get_session params
		key = RedisHelper::Author.get_key_session params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.get_key_session id
		"session/" + id.to_s
	end
end