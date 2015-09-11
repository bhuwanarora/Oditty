class FacebookLikesWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :facebook_likes

	def perform fb_id, user_id
		fb = FacebookLike.new(fb_id, user_id)
		if fb.need_to_fetch?
			id_likes = fb.fetch
			id_likes.each do |like_id|
				params = fb.fetch_info(id_likes)
				FacebookLikesBooksWorker.new.perform(params)
			end
		end
	end

	def self.set_info

	end
end