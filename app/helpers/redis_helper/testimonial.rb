module RedisHelper::Testimonial
	def self.delete_all
		key = RedisHelper::Testimonial.get_key_details
		RedisHelper.clear key
	end

	def self.set_all params
		key = RedisHelper::Testimonial.get_key_details params[:skip]
		$redis.set(key, params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_all skip
		key 	= RedisHelper::Testimonial.get_key_details skip
		info 	= $redis.get(key)
		output 	= JSON.parse(info) rescue []
		output
	end

	private
	def self.get_key_details skip = ""
		'testimonials' + skip
	end

end