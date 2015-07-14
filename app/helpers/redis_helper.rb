module RedisHelper
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
end