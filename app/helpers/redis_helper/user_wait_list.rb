module RedisHelper::UserWaitList
	UserWaitListBufferMin			= 25
	UserWaitListBufferMax 			= 45
	UserWaitListBufferkey			= 'user/buffer_count'
	UserWaitListDecrementOnSignIn 	= 10
	UserWaitListDecrementOnEachDay	= 10

	def self.push
		current_count = ($redis.get UserWaitListBufferkey).to_i
		current_count += 1
		$redis.set UserWaitListBufferkey, current_count
		(current_count - 1)
	end

	def self.pop
		current_count = ($redis.get UserWaitListBufferkey).to_i
		current_count -= 1
		$redis.set UserWaitListBufferkey, current_count
	end

	def self.reset
		key = UserWaitListBufferkey
		count = AlgorithmHelper.random(UserWaitListBufferMin, UserWaitListBufferMax)
		$redis.set key, count
	end
end