module RedisHelper::Community
	def self.delete_basic_community_info params
		# delete_basic_info
		key = RedisHelper.get_key_basic_community_info params[:id]
		$redis.del key
	end

	def self.set_basic_community_info params
		# set_basic_info
		key = RedisHelper.get_key_basic_community_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_basic_community_info params
		key = RedisHelper.get_key_basic_community_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_feed_community_info params
		key = RedisHelper.get_key_feed_community_info params[:id]
		$redis.del key
	end

	def self.set_feed_community_info params
		key = RedisHelper.get_key_feed_community_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_feed_community_info params
		key = RedisHelper.get_key_feed_community_info params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_important_community_info params
		key = RedisHelper.get_key_important_community_info params[:news_id], params[:community_id]
		$redis.del key
	end

	def self.set_important_community_info params
		key = RedisHelper.get_key_important_community_info params[:news_id], params[:community_id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_important_community_info params
		key = RedisHelper.get_key_important_community_info params[:news_id], params[:community_id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_suggest_communities params
		key = RedisHelper.get_key_suggest_communities params[:id]
		$redis.del key
	end

	def self.set_suggest_communities params
		key = RedisHelper.get_key_suggest_communities params[:id]
		output = params[:info].map{|elem| elem["id"]}
		$redis.set(key,output.to_json)
		$redis.expire(key, RedisHelper::DayExpiry)
		RedisWorker.perform_async({:work => RedisHelper::WorkUpdateSuggestCommunities,:ids => output})
	end

	def self.get_suggest_communities params
		output = nil
		key = RedisHelper.get_key_suggest_communities params[:id]
		community_ids = $redis.get(key)
		if community_ids.present?
			community_ids = JSON.parse(community_ids)
			output = []
			community_ids.each do |id|
				info = RedisHelper.get_basic_community_info({:id => id})
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

	def self.delete_community_videos params
		key = RedisHelper.get_key_community_videos params[:id]
		$redis.del key
	end

	def self.set_community_videos params
		key = RedisHelper.get_key_community_videos params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_community_videos params
		key = RedisHelper.get_key_community_videos params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.delete_community_books params
		key = RedisHelper.get_key_community_books params[:id]
		$redis.del key
	end

	def self.set_community_books params
		key = RedisHelper.get_key_community_books params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_community_books params
		key = RedisHelper.get_key_community_books params[:id]
		info = $redis.get(key)
		if !info.nil?
			info = JSON.parse(info) rescue []
		end
		info
	end

	def self.increment_community_info_view_count params
		redis_info = RedisHelper.get_basic_community_info params
		if redis_info.present?
			community_info = redis_info
			count = (params[:view_count].present?)? params[:view_count] : (community_info[0]["view_count"] + 1)
			community_info[0]["view_count"] = count
			community_info[0]["most_important_tag"][0]["view_count"] = count
			params[:info] = community_info
			RedisHelper.set_basic_community_info params
		end
	end

	private
	def self.get_key_basic_community_info id
		"BCI" + id.to_s
	end

	def self.get_key_feed_community_info id
		"FCI" + id.to_s
	end

	def self.get_key_important_community_info news_id, community_id
		#NI
		'ICI' + news_id.to_s + community_id.to_s
	end

	def self.get_key_suggest_communities id
		#trends
		'SC' + id.to_s
	end

	def self.get_key_community_videos id
		#GV
		'CV' + id.to_s
	end

	def self.get_key_community_books id
		#GV
		'CB' + id.to_s
	end
end