class User::FacebookUser < User
	AccessTokenKey = 'access_token'
	def initialize(params)
		@params = params
	end

	def add_info
		" SET user.fb_id = "+@params["id"]+", user.like_count = 0, user.rating_count = 0, user.timer_count = 0, user.dislike_count = 0, user.comment_count = 0, user.bookmark_count = 0, user.book_read_count = 0, user.follows_count = 0, user.followed_by_count = 0, user.name = \""+@params["name"].to_s+"\", user.last_book = "+Constant::Id::BestBook.to_s+", user.amateur = true, user.ask_info = true WITH user "
	end

	def self.create_facebook_user
		" CREATE UNIQUE (user)-[:FacebookAuth]->(facebook_user:FacebookUser) WITH user, facebook_user "
	end

	def match_user
		" MATCH (user:User)-[:FacebookAuth]->(facebook_user:FacebookUser) "\
		" WHERE facebook_user.id = \'" + @params["id"].to_s + "\' "\
		" WITH user, facebook_user "
	end

	def self.match
		" MATCH (user:User)-[:FacebookAuth]->(facebook_user:FacebookUser) "\
		" WITH user, facebook_user "
	end

	def self.id_info
		" ID(user) AS user_id, ID(facebook_user) AS fb_user_id, facebook_user.id AS fb_id "
	end

	def self.set_name name
		" SET user.name = COALESCE(user.name, \"" + name + "\" ), "\
		" user.first_name = COALESCE(user.first_name, \'" + name + "\') "
	end

	def set_recent_like unix_time
		match_user + " SET facebook_user.recent_like_created_at=" + unix_time.to_s
	end

	def self.parse_token_response response
		output = {}
		if !response.nil?
			response = response.split("&")
			if response.empty?
				output = {}
			else
				response.each do |elem|
					debugger
					key_value = elem.split("=")
					key = key_value[0]
					value = key_value[1]
					output[key] = value
				end
			end
		end
		output
	end

	def get_latest_like
		match_user + User.new(nil).match_facebook_likes + FacebookLike.order_desc + FacebookLike.limit(1) + User::FacebookUser.return_group("likes.timestamp AS created_at",FacebookLike.basic_info, User.fb_like_retrieval_time_info)
	end

	def set_access_token_when_expired
		valid = RedisHelper::Facebook.is_access_token_valid @params
		if !valid
			create_long_term_token @params[:auth_response]
		end
	end

	def create_long_term_token short_term_token
		get_request_string_params  = "grant_type=fb_exchange_token&"
		get_request_string_params += "client_id=" + Constant::Id::FacebookAppId.to_s + "&"
		get_request_string_params += "client_secret=" + ENV["app_secret"].to_s + "&"
		get_request_string_params += "fb_exchange_token=" + short_term_token
		get_request_string = "https://graph.facebook.com/oauth/access_token?" + get_request_string_params
		response = Net::HTTP.get(URI.parse(get_request_string))
		response = User::FacebookUser.parse_token_response response
		debugger
		if response[User::FacebookUser::AccessTokenKey].present?
			params=
			{
				:token 		=> response["access_token"],
				:id 		=> @params['id'],
				:expires 	=> Time.now().to_i + response["expires"].to_i
			}
			RedisHelper::Facebook.set_access_token params
		else
			puts "Error in getting long term access token..".red
		end
	end
end 