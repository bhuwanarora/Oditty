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

	def self.increment_notification_count id
		info = RedisHelper::User.get_details({:id => id})
		if info.present?
			nc = (info['notification_count'].present?) ? (info['notification_count'] + 1) : 1
			info['notification_count'] = nc
			RedisHelper::User.set_details({:id => id, :info => info})
		end
	end

	def self.reset_notification_count id
		info = RedisHelper::User.get_details({:id => id})
		if info.present?
			info['notification_count'] = 0
			RedisHelper::User.set_details({:id => id, :info => info})
		end
	end

	def self.delete_friend_of_friend_details params
		key = RedisHelper::User.get_key_friend_of_friend_details params[:id]
		$redis.del key
	end

	def self.set_friend_of_friend_details params
		key = RedisHelper::User.get_key_friend_of_friend_details params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_friend_of_friend_details params
		key = RedisHelper::User.get_key_friend_of_friend_details params[:id]
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