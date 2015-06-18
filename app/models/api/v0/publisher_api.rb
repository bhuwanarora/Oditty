module Api
	module V0
		class PublisherApi
			def self.get_info id
				info = Publisher.new(id).get_info.execute[0]
				info
			end
		end
	end
end