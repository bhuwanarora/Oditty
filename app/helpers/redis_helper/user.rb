module RedisHelper::User
	def self.delete_details params
		key = RedisHelper::User.get_key_details params[:id]
		$redis.del key
	end

	def self.set_details params
		key = RedisHelper::User.get_key_details params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_details params
		key = RedisHelper::User.get_key_details params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_friend_of_friend_details params
		key = RedisHelper.get_key_friend_of_friend_details params[:id]
		$redis.del key
	end

	def self.set_friend_of_friend_details params
		key = RedisHelper.get_key_friend_of_friend_details params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_friend_of_friend_details params
		key = RedisHelper.get_key_friend_of_friend_details params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	private
	def self.get_key_details id
		'GUD' + id.to_s
	end

	def self.get_key_friend_of_friend_details id
		"GFOF" + id.to_s
	end
end