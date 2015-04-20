module Api
	module V0
		class RealVirtualityApi
			def self.get_news id
				Book.new(id).get_news
			end
		end
	end
end 