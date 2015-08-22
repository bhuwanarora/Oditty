module RedisHelper
	HourExpiry	= 3600
	DayExpiry 	= 24*HourExpiry
	WeekExpiry	= DayExpiry*7
	MonthExpiry = DayExpiry*30
	WorkUpdateSuggestCommunities = 'WorkUpdateSuggestCommunities'

	def self.set_up_redis key, start_id = -1
		cur_id = 0
		if(!$redis[key].nil?)
			cur_id = $redis[key].to_i
		else
			cur_id = start_id
			$redis[key] = cur_id
		end
		cur_id
	end

	def self.update_redis key, value
		$redis[key] = value
	end
end