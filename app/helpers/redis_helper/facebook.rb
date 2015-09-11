module RedisHelper::Facebook
	Token 	= 'token'
	Expires = 'expires'
	def self.set_access_token params
		key = RedisHelper::Facebook.get_key_long_term_access_token params[:id]
		$redis.hmset(key, Token, params[:token], Expires, params[:expires])
	end

	def self.get_access_token params
		key = RedisHelper::Facebook.get_key_long_term_access_token params[:id]
		$redis.hmget key, Token
	end

	def self.is_access_token_valid params
		key = RedisHelper::Facebook.get_key_long_term_access_token params[:id]
		expire_time = $redis.hget(key, Expires).to_i rescue nil
		cur_time = Time.now.to_i
		output = !expire_time.nil? && (expire_time - cur_time > Constant::Time::OneDay)
		output
	end
	
	def self.get_key_long_term_access_token fb_id
		"FLTAC:" + fb_id.to_s
	end		
end