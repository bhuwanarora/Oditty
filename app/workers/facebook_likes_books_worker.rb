class FacebookLikesBooksWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :facebook_likes_books

	def perform params
		# ASHESH: Merge Facebook Page Info, Refer tmp/page.json for input, or explore facebook graph 
		# https://developers.facebook.com/tools/explorer/667868653261167/?method=GET&path=205344452828349&
		# Check information for different types of Categories
		# For location create separate Nodes for City, Country, State, Street etc, and a Node with the complete address.
		# ASHESH: Fetch and Link tags for this FacebookPage on the basis of the NLPService
		# Fetch Books for those tags from Google Books
		begin
			params = params["data"]
			node_id = FacebookLikesBooksHelper.set_node_property_recursive(params, nil, true)
			FacebookLikesBooksHelper.set_community_books node_id
			FacebookLikesBooksHelper.set_community_videos node_id
			FacebookLikesHelper.model_as_community node_id
			indexer_params =
			{
				:type => Constant::EntityLabel::Community,
				:response => node_id
			}
			IndexerWorker.new.perform(indexer_params)
			FacebookLike.new(nil, node_id).set_completed.execute
		rescue Exception => e
			puts e.to_s.red
		end
	end
end