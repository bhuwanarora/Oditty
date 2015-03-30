module Api
	module V0
		class InfinityApi
			def initialize(category=nil, author_id=nil, time_id=nil, era_id=nil)
				@category = category 
				@author_id = author_id 
				@time_id = time_id 
				@era_id = era_id 
			end
			def get_books
				info = Infinity.new(@category, @author_id, @time_id, @era_id).get_books.execute
			end
		end
	end
end