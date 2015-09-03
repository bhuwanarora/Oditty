class VideosWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :default

	WorkAddToCommunityAutomated = 'WorkAddToCommunityAutomated'
	def perform work, params
		case work
		when WorkAddToCommunityAutomated
			VideosWorker.add_to_community params["id"]
		end
		# ASHESH: Merge Facebook Page Info, Refer tmp/page.json for input, or explore facebook graph 
		# https://developers.facebook.com/tools/explorer/667868653261167/?method=GET&path=205344452828349&
		# Check information for different types of Categories
		# For location create separate Nodes for City, Country, State, Street etc, and a Node with the complete address.
		# ASHESH: Fetch and Link tags for this FacebookPage on the basis of the NLPService
		# Fetch Books for those tags from Google Books
	end

	def self.add_to_community community_id
		community = (Community.new(community_id).match + ""\
			" WHERE NOT (community)-[:HasVideo]->() "\
			" RETURN community.name AS name ").execute
		if community.present?
			community_name = community[0]['name']
			google_content = GoogleSearchHelper.search_multiple_types(community_name,
					[GoogleSearchHelper::SearchTypes[:video]])
			videos = google_content[GoogleSearchHelper::SearchTypes[:video]]
			clause = CommunitiesHelper.map_videos_by_id community_id, videos
			clause += " RETURN ID(community) AS id "
			clause.execute
			RedisHelper.update community_id, Constant::EntityLabel::Community
		end
	end
end