class FacebookLikesWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :facebook_likes

	def perform params, user_id
		FacebookLikesHelper.add_facebook_likes(params, user_id)
		clause = User.new(user_id).match + User.set_facebook_likes_retrieval_time
		clause.execute
	end
end