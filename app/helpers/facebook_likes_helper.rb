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

	def self.fetch fb_id
		clause = FacebookLike.new(fb_id).match + FacebookUser.get_latest_like
		output = clause.execute[0]
		FacebookLikesHelper.fetch_likes_iterative(fb_id, output["user_id"], output["created_at"])
	end

	def self.fetch_likes_iterative fb_id, user_id, stop_time
		url = Rails.application.config.fb_graph_url + fb_id.to_s + "/likes?access_token="
		url += RedisHelper::Facebook.get_access_token({:id => fb_id}).to_s
		next_iteration = true
		while next_iteration
			response = Net.HTTP.get(URI.parse(url))
			FacebookLikesHelper.add_facebook_likes(response, user_id)
			next_iteration = FacebookLikesHelper.next_iteration_needed(response, stop_time)
		end
	end

	def self.next_iteration_needed(response, stop_time)
		likes = response["data"]
		earliest_like = likes[likes.length - 1]
		like_time = TimeHelper::Facebook.unix(earliest_like["created_time"])
		output = like_time < stop_time
		output
	end

private

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