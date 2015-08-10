module RedisHelper
	HourExpiry	= 3600
	DayExpiry 	= 24*HourExpiry
	WeekExpiry	= DayExpiry*7
	MonthExpiry = DayExpiry*30

	def self.set_up_redis key, start_id
		cur_id = 0
		if(!$redis[key].nil?)
			cur_id = $redis[key].to_i
		else
			cur_id = start_id
			$redis[key] = cur_id
		end
		cur_id
	end

	def self.delete_user_details params
		id = params[:id]
		key = RedisHelper.get_key_user_details id
		$redis.del key
	end

	def self.set_user_details params
		id = params[:id]
		key = RedisHelper.get_key_user_details id
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_user_details params
		id = params[:id]
		key = RedisHelper.get_key_user_details id
		info = $redis.get(key)
		info
	end

	def self.delete_friend_of_friend_details params
		id = params[:id]
		key = RedisHelper.get_key_friend_of_friend_details id
		$redis.del key
	end

	def self.set_friend_of_friend_details params
		id = params[:id]
		key = RedisHelper.get_key_friend_of_friend_details id
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_friend_of_friend_details params
		id = params[:id]
		key = RedisHelper.get_key_friend_of_friend_details id
		info = $redis.get(key)
		info
	end

	def self.delete_basic_community_info params
		id = params[:id]
		key = RedisHelper.get_key_basic_community_info id
		$redis.del key
	end

	def self.set_basic_community_info params
		id = params[:id]
		key = RedisHelper.get_key_basic_community_info id
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_basic_community_info params
		id = params[:id]
		key = RedisHelper.get_key_basic_community_info id
		info = $redis.get(key)
		info
	end

	def self.delete_feed_community_info params
		id = params[:id]
		key = RedisHelper.get_key_feed_community_info id
		$redis.del key
	end

	def self.set_feed_community_info params
		id = params[:id]
		key = RedisHelper.get_key_feed_community_info id
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_feed_community_info params
		id = params[:id]
		key = RedisHelper.get_key_feed_community_info id
		info = $redis.get(key)
		info
	end

	def self.delete_chronological_news_info params
		id = params[:id]
		key = RedisHelper.get_key_cronological_news id
		$redis.del key
	end

	def self.set_chronological_news_info params
		id = params[:id]
		key = RedisHelper.get_key_cronological_news id
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_chronological_news_info params
		id = params[:id]
		key = RedisHelper.get_key_cronological_news id
		info = $redis.get(key)
		info
	end

	def self.delete_genre_details params
		id = params[:id]
		key = RedisHelper.get_key_genre_details id
		$redis.del key
	end

	def self.set_genre_details params
		id = params[:id]
		key = RedisHelper.get_key_genre_details id
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_genre_details params
		id = params[:id]
		key = RedisHelper.get_key_genre_details id
		info = $redis.get(key)
		info
	end

	private

	# Note: Please write key functions in sorted (ascending) order. !!!
	def self.get_key_cronological_news id
		"CN" + id.to_s
	end

	def self.get_key_basic_community_info id
		"BCI" + id.to_s
	end

	def self.get_key_feed_community_info id
		"FCI" + id.to_s
	end

	def self.get_key_friend_of_friend_details id
		"GFOF" + id.to_s
	end
	
	def self.get_key_genre_details id
		"GGD" + id.to_s
	end
	
	def self.get_key_user_details id
		'GUD' + id.to_s
	end


end