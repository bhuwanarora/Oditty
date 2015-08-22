module RedisHelper::Publisher

	def self.delete_info params
		key = RedisHelper::Publisher.get_key_info params[:id]
		$redis.del key
	end

	def self.set_info params
		key = RedisHelper::Publisher.get_key_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_info params
		key = RedisHelper::Publisher.get_key_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_books params
		key = RedisHelper::Publisher.get_key_books params[:id]
		$redis.del key
	end

	def self.set_books params
		key = RedisHelper::Publisher.get_key_books params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_books params
		key = RedisHelper::Publisher.get_key_books params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	private
	def self.get_key_info id
		#"GI"
		"PI" + id.to_s
	end

	def self.get_key_books id
		"PB" + id.to_s
	end
end