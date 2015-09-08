module RedisHelper::Game
	SortedSetKey = 'sorted_game_set'
	
	def self.delete_user_info params
		key = RedisHelper::Genre.get_key_user_info params[:id]
		$redis.del key
	end

	def self.set_user_info params
		key = RedisHelper::Genre.get_key_user_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_user_info params
		key = RedisHelper::Genre.get_key_user_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_user_rank params
		key = RedisHelper::Genre.get_key_user_rank params[:id]
		$redis.zrem SortedSetKey key
	end

	def self.set_user_rank params
		key   = RedisHelper::Genre.get_key_details params[:id]
		score = params[:score]
		$redis.zincrby SortedSetKey score key
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_user_rank params
		key  = RedisHelper::Genre.get_key_user_rank params[:id]
		rank = $redis.zrank SortedSetKey key
		rank
	end

	def self.get_top_rankers params
		skip = params[:skip]
		keys = $redis.zrevrange skip, 10
		output = []
		keys.each do |key|
			output << RedisHelper::Game.get_user_info(RedisHelper.get_id_from_user_rank_key(key))
		end
		output
	end

private
	def self.get_key_user_rank user_id
		"UserRank" + user_id.to_s
	end

	def self.get_id_from_user_rank_key key
		key.gsub("UserRank","").strip.to_i
	end

	def self.get_key_user_info
		"UserInfo" + user_id.to_s
	end

end