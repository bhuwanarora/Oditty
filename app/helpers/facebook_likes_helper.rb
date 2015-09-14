module FacebookLikesHelper

	def self.set_facebook_likes_retrieval_time user_id
		clause = User.new(user_id).match + User.set_facebook_likes_retrieval_time
		clause.execute
	end


	def self.model_as_community node_id
		clause = FacebookLike.new(nil, node_id).match_by_neo_id +
				" OPTIONAL " + FacebookLike.get_image_url +
				" RETURN facebook_like.name AS name, image_url "
		neo_output = clause.execute[0]
		web_urls  = GoogleSearchHelper.get_web_urls neo_output["name"]
		image_url = neo_output["image_url"]
		if image_url.present?
			web_urls.merge!({:image => image_url})
		end
		clause  = FacebookLike.new(nil, node_id).match_by_neo_id
		clause += FacebookLikesHelper.set_community_properties(web_urls, neo_output["name"])
		clause.execute
	end

	def self.set_community_properties web_urls, name
		search_index = name.search_ready
		" SET " +
		"facebook_like.wiki_url = \'" + web_urls[:wiki_url] + "\', " +
		"facebook_like.image_url = \'" + web_urls[:image] + "\', " +
		"facebook_like.status = 1, " +
		"facebook_like.created_at = facebook_like.created_time, " +
		"facebook_like.view_count = 0, " +
		"facebook_like.follow_count = 0, " +
		"facebook_like.facebook_url = facebook_like.link, " +
		"facebook_like.twitter_url = \'" + web_urls[:twitter_url] + "\', " +
		"facebook_like.indexed_community_name = \'" + search_index + "\', " +
		"facebook_like.search_index = \'" + search_index + "\' "
	end

	def self.need_to_fetch created_at, facebook_likes_retrieval_time = 0
		last_like_reason = (Time.now().to_i - created_at) > Constant::Time::OneDay
		last_check_reason = ((Time.now().to_i - facebook_likes_retrieval_time) > Constant::Time::OneDay) rescue true
		last_check_reason && last_like_reason
	end

	def self.fetch user_fb_id
		clause = User::FacebookUser.new({'id' => user_fb_id}).get_latest_like
		output = clause.execute[0]
		user_id = output["user_id"]
		need_to_fetch_likes = FacebookLikesHelper.need_to_fetch output["created_at"], output["facebook_likes_retrieval_time"]
		if need_to_fetch_likes
			new_fb_like_ids = FacebookLikesHelper.fetch_likes_iterative(user_fb_id, user_id, output["created_at"])
			FacebookLikesHelper.set_facebook_likes_retrieval_time user_id
		else
			new_fb_like_ids = []
		end
		new_fb_like_ids
	end

	def self.fetch_likes_iterative user_fb_id, user_id, stop_time
		url = Rails.application.config.fb_graph_url + user_fb_id.to_s + "/likes?"
		access_token_string = "access_token=" + RedisHelper::Facebook.get_access_token({:id => user_fb_id}) rescue nil
		if access_token_string.nil?
			puts " Access token not present in redis  for user:#{user_id}!!".red
			id_list = []
		else
			url += access_token_string
			next_iteration = true
			id_list = []
			while next_iteration && url.present?
				response = JSON.parse(Net::HTTP.get(URI.parse(url)))
				FacebookLikesHelper.add_facebook_likes(response, user_id)
				new_like_count = FacebookLikesHelper.next_iteration_needed(response, stop_time)
				next_iteration = new_like_count == response["data"].length
				id_list += response["data"][0..(new_like_count - 1)].map{|like| (like["id"].to_i)}
				url = FacebookLikesHelper.get_next_likes_url response
			end
		end
		id_list
	end

	def self.next_iteration_needed(response, stop_time)
		likes = response["data"]
		earliest_like = likes[likes.length - 1]
		recent_like_count = 0
		likes.each do |like|
			like_time = TimeHelper::Facebook.unix(like["created_time"])
			recent_like = like_time > stop_time
			if !recent_like
				break
			else
				recent_like_count += 1
			end
		end
		recent_like_count
	end

	def self.get_info user_fb_id, facebook_like_id
		url = Rails.application.config.fb_graph_url + facebook_like_id.to_s + "?"
		access_token_string = "access_token=" + RedisHelper::Facebook.get_access_token({:id => user_fb_id})
		url += access_token_string
		response = JSON.parse(Net::HTTP.get(URI.parse(url)))
	end

	def self.fetch_backlog_likes
		output = (User::FacebookUser.match + User::FacebookUser.return_group(User::FacebookUser.id_info)).execute
		output.each do |fb_user|
			user_id = fb_user["user_id"]
			fb_id = fb_user["fb_id"].to_i
			ids = FacebookLikesHelper.fetch_likes_iterative fb_id, user_id, 0
			ids.each do |fb_like_id|
				params = FacebookLikesHelper.get_info(fb_id, fb_like_id)
				FacebookLikesBooksWorker.new.perform(params)
			end
		end
	end

	def self.set_backlog_likes_info
		clause = User.match_facebook_likes + FacebookLike.not_completed + FacebookLike.return_group(FacebookLike.basic_info)
		output = clause.execute
		facebook_like_id_list = output.map { |like| (like["app_id"]) }
		facebook_like_id_list.each do |id|
			params = FacebookLikesHelper.get_info(id)
			FacebookLikesBooksWorker.new.perform(params)
		end
	end

private

	def self.get_next_likes_url likes_data
		likes_data["paging"]["next"]
	end

	def self.add_facebook_likes(params, user_id)
		data = params["data"]
		for like in data
			app_id = like["id"]
			category = like["category"]
			created_time = like["created_time"].to_time.to_i
			name = like["name"]
			@facebook_like = FacebookLike.new(app_id)
			@facebook_like.merge_info(category, created_time, name).execute
			@user = User.new(user_id)
			clause = @user.match + @facebook_like.match + ", user " + @user.create_like(created_time) + " RETURN ID(user)"
			clause.execute
		end
	end
end