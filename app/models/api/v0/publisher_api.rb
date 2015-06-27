module Api
	module V0
		class PublisherApi
			def self.get_info id
				info = Publisher.new(id).get_info.execute[0]
				info
			end

			def self.get_books id
				info = Publisher.new(id).get_books.execute
				info
			end
		end
	end
end