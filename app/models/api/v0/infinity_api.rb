module Api
	module V0
		class InfinityApi
			def self.get_books filters
				info = Infinity.new(filters).get_books.execute[0]
			end
		end
	end
end