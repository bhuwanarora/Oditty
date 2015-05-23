class User::FacebookUser < User
	def initialize(params)
		@params = params
	end

	def add_info
		" SET user.fb_id = "+@params["id"]+", user.like_count = 0, user.rating_count = 0, user.timer_count = 0, user.dislike_count = 0, user.comment_count = 0, user.bookmark_count = 0, user.book_read_count = 0, user.follows_count = 0, user.followed_by_count = 0, user.name = \""+@params["name"].to_s+"\", user.last_book = "+Constant::Id::BestBook.to_s+", user.amateur = true, user.ask_info = true WITH user "
	end

	def self.create_facebook_user
		" CREATE UNIQUE (user)-[:FacebookAuth]->(facebook_user:FacebookUser) WITH user, facebook_user "
	end

	def self.set_name name
		" SET user.name = COALESCE(user.name, \"" + name + "\" ) "
	end
end 