module RedisHelper::Publisher

	def self.delete_publisher_info params
		key = RedisHelper.get_key_publisher_info params[:id]
		$redis.del key
	end

	def self.set_publisher_info params
		key = RedisHelper.get_key_publisher_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_publisher_info params
		key = RedisHelper.get_key_publisher_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_publisher_books params
		key = RedisHelper.get_key_publisher_books params[:id]
		$redis.del key
	end

	def self.set_publisher_books params
		key = RedisHelper.get_key_publisher_books params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_publisher_books params
		key = RedisHelper.get_key_publisher_books params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	private
	def self.get_key_publisher_info id
		#"GI"
		"PI" + id.to_s
	end
end