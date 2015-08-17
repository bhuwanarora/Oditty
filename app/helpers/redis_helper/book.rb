module RedisHelper::Book
	def self.delete_book_primary_info params
		key = RedisHelper.get_key_book_primary_info params[:id]
		$redis.del key
	end

	def self.set_book_primary_info params
		key = RedisHelper.get_key_book_primary_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_book_primary_info params
		key = RedisHelper.get_key_book_primary_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_basic_feed_book_info params
		key = RedisHelper.get_key_basic_feed_book_info params[:id]
		$redis.del key
	end

	def self.set_basic_feed_book_info params
		key = RedisHelper.get_key_basic_feed_book_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_basic_feed_book_info params
		key = RedisHelper.get_key_basic_feed_book_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_book_interesting_info params
		key = RedisHelper.get_key_book_interesting_info params[:id]
		$redis.del key
	end

	def self.set_book_interesting_info params
		key = RedisHelper.get_key_book_interesting_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_book_interesting_info params
		key = RedisHelper.get_key_book_interesting_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_virtuality_book_news params
		key = RedisHelper.get_key_real_virtuality_book_news params[:id]
		$redis.del key
	end

	def self.set_virtuality_book_news params
		key = RedisHelper.get_key_real_virtuality_book_news params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::DayExpiry)
	end

	def self.get_virtuality_book_news params
		key = RedisHelper.get_key_real_virtuality_book_news params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	private
	def self.get_key_book_primary_info id
		"BPI" + id.to_s
	end

	def self.get_key_basic_feed_book_info id
		"BFBI" + id.to_s
	end

	def self.get_key_book_interesting_info id
		"BIF" + id.to_s
	end

	def self.get_key_real_virtuality_book_news id
		#BN
		'RVBN' + id.to_s
	end
end