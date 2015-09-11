module FacebookLikesHelper

	def self.add params, user_id
		FacebookLikesHelper.add_facebook_likes(params, user_id)
		clause = User.new(user_id).match + User.set_facebook_likes_retrieval_time
		clause.execute
	end


	def self.model_as_community node_id
		clause = FacebookLike.new(nil, node_id).match_by_neo_id +
				FacebookLike.get_image_url +
				" RETURN facebook_like.name AS name, image_url "
		neo_output = clause.execute[0]
		web_urls  = GoogleSearchHelper.get_web_urls neo_output["name"]
		image_url = neo_output["image_url"]
		web_urls.merge!({:image => image_url})

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

	def self.need_to_fetch created_at
		(Time.now().to_i - created_at) > Constant::Time::OneDay
	end

	def self.fetch user_fb_id
		clause = FacebookUser.new({'id' => user_fb_id}).get_latest_like
		output = clause.execute[0]
		need_to_fetch_likes = FacebookLikesHelper.need_to_fetch output["created_at"]
		if need_to_fetch_likes
			new_fb_like_ids = FacebookLikesHelper.fetch_likes_iterative(user_fb_id, output["user_id"], output["created_at"])
		else
			new_fb_like_ids = []
		end
		new_fb_like_ids
	end

	def self.fetch_likes_iterative user_fb_id, user_id, stop_time
		url = Rails.application.config.fb_graph_url + user_fb_id.to_s + "/likes?"
		access_token_string = "access_token=" + RedisHelper::Facebook.get_access_token({:id => user_fb_id})
		url += access_token_string
		next_iteration = true
		id_list = []
		while next_iteration && url.present?
			response = Net.HTTP.get(URI.parse(url))
			FacebookLikesHelper.add_facebook_likes(response, user_id)
			new_like_count = FacebookLikesHelper.next_iteration_needed(response, stop_time)
			next_iteration = new_like_count == response["data"].length
			id_list += response["data"][0..(new_like_count - 1)].map{|like| (like["id"].to_i)}
			url = FacebookLikesHelper.get_next_likes_url response["data", access_token_string
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

	def self.set_info user_fb_id, facebook_like_id
		url = Rails.application.config.fb_graph_url + facebook_like_id.to_s + "?"
		access_token_string = "access_token=" + RedisHelper::Facebook.get_access_token({:id => user_fb_id})
		url += access_token_string
		response = Net::HTTP.get(URI.parse(url))
	end

	def self.backlog_fetch_info
		clause = User.match_facebook_likes + FacebookLike.not_completed + FacebookLike.return_group(FacebookLike.basic_info)
		output = clause.execute
		facebook_like_id_list = output.map { |like| (like["app_id"]) }
		facebook_like_id_list.each{|id| FacebookLikesHelper.set_info(id)}
	end

private

	def self.get_next_likes_url likes_data, access_token_string
		output = (likes_data["paging"]["next"] + "&" + access_token_string) rescue ""
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