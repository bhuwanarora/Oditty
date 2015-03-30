module Api
	module V0
		class InfinityApi
			def initialize(category, author_id, time_id, era_id, skip_count)
				@category = category 
				@author_id = author_id 
				@time_id = time_id 
				@era_id = era_id 
				@skip_count = skip_count
			end
			def get_books
				info = Infinity.new(@category, @author_id, @time_id, @era_id, @skip_count).get_books.execute
			end
		end
	end
end