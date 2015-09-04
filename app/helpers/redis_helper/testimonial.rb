module RedisHelper::Testimonial
	def self.delete_all
		key = RedisHelper::User.get_key_details
		$redis.del key
	end

	def self.set_all skip
		key = RedisHelper::User.get_key_details skip
		$redis.set(key, params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_all skip
		key = RedisHelper::Testimonial.get_key_details skip
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	
	private
	def self.get_key_details skip
		if skip
			'testimonials' + skip.to_s
		else
			'testimonials*'
		end
	end

end