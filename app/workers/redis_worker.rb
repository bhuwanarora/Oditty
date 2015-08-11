class RedisWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :default

	def perform params
		work = params["work"]
		case work
		when RedisHelper::WorkUpdateSuggestCommunities
			RedisWorker.update_suggest_communities_view_count params["ids"]
		end
	end

	def self.update_suggest_communities_view_count community_id_array
		community_id_array.each do |id|
			info = Api::V0::WebsiteApi.get_basic_community_info(id).execute
			RedisHelper.set_basic_community_info({:id => id, :info => info})
		end
	end
end