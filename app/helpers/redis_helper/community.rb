module RedisHelper::Community
	def self.delete_basic_info params
		key = RedisHelper::Community.get_key_basic_info params[:id]
		$redis.del key
	end

	def self.set_basic_info params
		key = RedisHelper::Community.get_key_basic_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_basic_info params
		key = RedisHelper::Community.get_key_basic_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_feed_info params
		key = RedisHelper::Community.get_key_feed_info params[:id]
		$redis.del key
	end

	def self.set_feed_info params
		key = RedisHelper::Community.get_key_feed_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_feed_info params
		key = RedisHelper::Community.get_key_feed_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_important_info params
		key = RedisHelper::Community.get_key_important_info params[:news_id], params[:community_id]
		$redis.del key
	end

	def self.set_important_info params
		key = RedisHelper::Community.get_key_important_info params[:news_id], params[:community_id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_important_info params
		key = RedisHelper::Community.get_key_important_info params[:news_id], params[:community_id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_suggested params
		key = RedisHelper::Community.get_key_suggested params[:id]
		$redis.del key
	end

	def self.set_suggested params
		key = RedisHelper::Community.get_key_suggested params[:id]
		output = params[:info].map{|elem| elem["id"]}
		$redis.set(key,output.to_json)
		$redis.expire(key, RedisHelper::DayExpiry)
		RedisWorker.perform_async({:work => RedisHelper::WorkUpdateSuggestCommunities,:ids => output})
	end

	def self.get_suggested params
		output = nil
		key = RedisHelper::Community.get_key_suggested params[:id]
		community_ids = $redis.get(key)
		if community_ids.present?
			community_ids = JSON.parse(community_ids)
			output = []
			community_ids.each do |id|
				info = RedisHelper::Community.get_basic_info({:id => id})
				if info.nil?
					output = nil
					break
				else
					output << info[0].except("most_important_tag")
				end
			end
		end
		output
	end

	def self.delete_videos params
		key = RedisHelper::Community.get_key_videos params[:id]
		$redis.del key
	end

	def self.set_videos params
		key = RedisHelper::Community.get_key_videos params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_videos params
		key = RedisHelper::Community.get_key_videos params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_books params
		key = RedisHelper::Community.get_key_books params[:id]
		$redis.del key
	end

	def self.set_books params
		key = RedisHelper::Community.get_key_books params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_books params
		key = RedisHelper::Community.get_key_books params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.increment_view_count params
		redis_info = RedisHelper::Community.get_basic_info params
		if redis_info.present?
			community_info = redis_info
			count = (params[:view_count].present?)? params[:view_count] : (community_info[0]["view_count"] + 1)
			community_info[0]["view_count"] = count
			community_info[0]["most_important_tag"][0]["view_count"] = count
			params[:info] = community_info
			RedisHelper::Community.set_basic_info params
		end
	end

	private
	def self.get_key_basic_info id
		"BCI" + id.to_s
	end

	def self.get_key_feed_info id
		"FCI" + id.to_s
	end

	def self.get_key_important_info news_id, community_id
		#NI
		'ICI' + news_id.to_s + community_id.to_s
	end

	def self.get_key_suggested id
		#trends
		'SC' + id.to_s
	end

	def self.get_key_videos id
		#GV
		'CV' + id.to_s
	end

	def self.get_key_books id
		#GV
		'CB' + id.to_s
	end
end