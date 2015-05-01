class User::FacebookUser < User
	def initialize(params)
		@params = params
	end

	def merge
		" MERGE (user:User{fb_id:" + @params["id"].to_s + "}) WITH user " + User::FacebookUser.create_facebook_user
	end

	def create
		" CREATE (user:User{fb_id:"+@params["id"]+", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, name:\""+@params["name"].to_s+"\", last_book:"+Constant::Id::BestBook.to_s+", amateur: true, ask_info: true}) WITH user "
	end

	def self.create_facebook_user
		" CREATE UNIQUE (user)-[:FacebookAuth]->(facebook_user:FacebookUser) WITH user, facebook_user "
	end

	def self.set_name name
		" SET user.thumb = COALESCE(user.name, \"" + name + "\" ) "
	end
end 