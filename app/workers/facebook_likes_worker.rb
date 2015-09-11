class FacebookLikesWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :facebook_likes

	def perform fb_id, user_id
		id_likes = FacebookLikesHelper.fetch fb_id
		id_likes.each do |like_id|
			params = FacebookLikesHelper.set_info(id_likes)
			FacebookLikesBooksWorker.new.perform(params)
		end
	end
end