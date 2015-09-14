class FacebookLikesWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :facebook_likes

	def perform fb_id, user_id
		id_likes = FacebookLikesHelper.fetch fb_id
		id_likes.each do |like_id|
			params = FacebookLikesHelper.get_info(fb_id, like_id)
			FacebookLikesBooksWorker.new.perform(params)
		end
	end
end