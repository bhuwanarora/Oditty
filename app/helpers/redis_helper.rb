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
		key = RedisHelper.get_key_user_details params[:id]
		$redis.del key
	end

	def self.set_user_details params
		key = RedisHelper.get_key_user_details params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_user_details params
		key = RedisHelper.get_key_user_details params[:id]
		info = $redis.get(key)
		info
	end

	def self.delete_friend_of_friend_details params
		key = RedisHelper.get_key_friend_of_friend_details params[:id]
		$redis.del key
	end

	def self.set_friend_of_friend_details params
		key = RedisHelper.get_key_friend_of_friend_details params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_friend_of_friend_details params
		key = RedisHelper.get_key_friend_of_friend_details params[:id]
		info = $redis.get(key)
		info
	end

	def self.delete_basic_community_info params
		key = RedisHelper.get_key_basic_community_info params[:id]
		$redis.del key
	end

	def self.set_basic_community_info params
		key = RedisHelper.get_key_basic_community_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_basic_community_info params
		key = RedisHelper.get_key_basic_community_info params[:id]
		info = $redis.get(key)
		info
	end

	def self.delete_basic_author_info params
		key = RedisHelper.get_key_basic_author_info params[:id]
		$redis.del key
	end

	def self.set_basic_author_info params
		key = RedisHelper.get_key_basic_author_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_basic_author_info params
		key = RedisHelper.get_key_basic_author_info params[:id]
		info = $redis.get(key)
		info
	end

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
		info
	end

	def self.delete_chronological_news_info params
		key = RedisHelper.get_key_cronological_news params[:id]
		$redis.del key
	end

	def self.set_chronological_news_info params
		key = RedisHelper.get_key_cronological_news params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_chronological_news_info params
		key = RedisHelper.get_key_cronological_news params[:id]
		info = $redis.get(key)
		info
	end

	def self.delete_genre_details params
		key = RedisHelper.get_key_genre_details params[:id]
		$redis.del key
	end

	def self.set_genre_details params
		key = RedisHelper.get_key_genre_details params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_genre_details params
		key = RedisHelper.get_key_genre_details params[:id]
		info = $redis.get(key)
		info
	end

	def self.delete_interview_details params
		key = RedisHelper.get_key_interview_details params[:id]
		$redis.del key
	end

	def self.set_interview_details params
		key = RedisHelper.get_key_interview_details params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_interview_details params
		key = RedisHelper.get_key_interview_details params[:id]
		info = $redis.get(key)
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
		info
	end

	def self.delete_suggest_communities params
		key = RedisHelper.get_key_suggest_communities params[:id]
		$redis.del key
	end

	def self.set_suggest_communities params
		key = RedisHelper.get_key_suggest_communities params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_suggest_communities params
		key = RedisHelper.get_key_suggest_communities params[:id]
		info = $redis.get(key)
		info
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
		info
	end

	def self.delete_publisher_info params
		key = RedisHelper.get_key_publisher_info params[:id]
		$redis.del key
	end

	def self.set_publisher_info params
		key = RedisHelper.get_key_publisher_info params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_publisher_info params
		key = RedisHelper.get_key_publisher_info params[:id]
		info = $redis.get(key)
		info
	end

	def self.delete_publisher_books params
		key = RedisHelper.get_key_publisher_books params[:id]
		$redis.del key
	end

	def self.set_publisher_books params
		key = RedisHelper.get_key_publisher_books params[:id]
		$redis.set(key,params[:info].to_json)
		$redis.expire(key, RedisHelper::MonthExpiry)
	end

	def self.get_publisher_books params
		key = RedisHelper.get_key_publisher_books params[:id]
		info = $redis.get(key)
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
		info
	end

	private

	# Note: Please write key functions in sorted (ascending) order. !!!
	def self.get_key_basic_author_info id
		'BAI' + id.to_s
	end

	def self.get_key_basic_community_info id
		"BCI" + id.to_s
	end

	def self.get_key_basic_feed_book_info id
		"BFBI" + id.to_s
	end

	def self.get_key_book_interesting_info id
		"BIF" + id.to_s
	end

	def self.get_key_book_primary_info id
		"BPI" + id.to_s
	end

	def self.get_key_community_books id
		#GV
		'CB' + id.to_s
	end

	def self.get_key_cronological_news id
		"CN" + id.to_s
	end

	def self.get_key_community_videos id
		#GV
		'CV' + id.to_s
	end


	def self.get_key_feed_community_info id
		"FCI" + id.to_s
	end

	def self.get_key_friend_of_friend_details id
		"GFOF" + id.to_s
	end
	
	def self.get_key_interview_details id
		"GID" + id.to_s
	end

	def self.get_key_genre_details id
		"GGD" + id.to_s
	end
	
	def self.get_key_user_details id
		'GUD' + id.to_s
	end

	def self.get_key_important_community_info news_id, community_id
		#NI
		'ICI' + news_id.to_s + community_id.to_s
	end

	def self.get_key_publisher_books id
		#"GB"
		"PB" + id.to_s
	end

	def self.get_key_publisher_info id
		#"GI"
		"PI" + id.to_s
	end

	def self.get_key_real_virtuality_book_news id
		#BN
		'RVBN' + id.to_s
	end

	def self.get_key_suggest_communities id
		#trends
		'SC' + id.to_s
	end
end