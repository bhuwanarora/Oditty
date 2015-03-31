module Api
	module V0
		class InfinityApi
			def self.get_books filters
				info = Infinity.new(filters).books.execute
			end
		end
	end
end