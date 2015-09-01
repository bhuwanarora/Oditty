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

	def self.update_value key, value
		$redis[key] = value
	end

	def self.update id, entity_type
		case entity_type
		when Constant::EntityLabel::Author
			RedisHelper.update_author id
		when Constant::EntityLabel::Book
			RedisHelper.update_book id
		when Constant::EntityLabel::Community
			RedisHelper.update_community id
		when Constant::EntityLabel::User
			RedisHelper.update_user id
		end
	end

	def self.clear substring
		begin
			keys = []
			if(substring.is_a? Array)
				keys = substring.each{|elem| keys += ($redis.keys('*' + elem.to_s + '*'))}
			else
				keys = $redis.keys('*' + substring.to_s + '*')
			end
			$redis.del keys
		rescue Exception => e
			puts ("No keys exist containing substring:'" + substring.to_s + "' .No keys deleted.").red
		end
	end

	def self.update_book id
		RedisHelper.clear id
		rel_communities = BookHelper.get_related_communities id
		RedisHelper.clear(rel_communities.map{|community| community["id"]})
	end

	def self.update_author id
		RedisHelper.clear id
	end

	def self.update_community id
		RedisHelper.clear id
	end

	def self.update_user id
		RedisHelper.clear id
	end
end