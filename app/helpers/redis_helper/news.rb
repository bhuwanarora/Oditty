module RedisHelper::News

	def self.delete_chronological_news_info params
		key = RedisHelper.get_key_cronological_news params[:id]
		$redis.del key
	end

	def self.set_chronological_news_info params
		key = RedisHelper.get_key_cronological_news params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_chronological_news_info params
		key = RedisHelper.get_key_cronological_news params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	private
	def self.get_key_cronological_news id
		"CN" + id.to_s
	end
end