module RedisHelper::Game
	SortedSetKey = 'sorted_game_set'
	
	def self.delete_user_info params
		key = RedisHelper::Game.get_key_user_info params[:id]
		$redis.del key
	end

	def self.set_user_info params
		key = RedisHelper::Game.get_key_user_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_user_info params
		key = RedisHelper::Game.get_key_user_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_user_rank params
		key = RedisHelper::Game.get_key_user_rank params[:id]
		$redis.zrem SortedSetKey, key
	end

	def self.set_user_rank params
		key   = RedisHelper::Game.get_key_user_rank params[:id]
		score = params[:score]
		$redis.zincrby SortedSetKey, score, key

		user_info = RedisHelper::Game.get_user_info params
		unless user_info.nil?
			user_info["score"] = (user_info["score"] + score) rescue score
			user_info["games"] = (user_info["games"] + 1) rescue 1
			info_params =
			{
				:id => params[:id],
				:info => user_info
			}
			RedisHelper::Game.set_user_info info_params
		end
	end

	def self.get_user_rank params
		key  = RedisHelper::Game.get_key_user_rank params[:id]
		rank = $redis.zrevrank SortedSetKey, key
		rank + 1
	end

	def self.get_top_rankers params
		skip = params[:skip]
		keys = $redis.zrevrange SortedSetKey, skip, 10
		output = []
		rank_current = skip + 1
		keys.each do |key|
			param_info = {:id => RedisHelper::Game.get_id_from_user_rank_key(key)}
			user_info = RedisHelper::Game.get_user_info(param_info)
			if user_info.nil?
				user_info = Api::V0::GamesApi.get_user_info(param_info[:id]).execute[0]
				param_info[:info] = user_info
				RedisHelper::Game.set_user_info(param_info)
			end
			user_info["ranking"] = rank_current
			output << user_info
			rank_current += 1
		end
		output
	end

	def self.clean_up
		RedisHelper.clear(RedisHelper::Game.get_key_user_rank(""))
		RedisHelper.clear(RedisHelper::Game.get_key_user_info(""))
	end

private
	def self.get_key_user_rank user_id
		"UserRank" + user_id.to_s
	end

	def self.get_id_from_user_rank_key key
		key.gsub("UserRank","").strip.to_i
	end

	def self.get_key_user_info user_id
		"UserInfo" + user_id.to_s
	end

end