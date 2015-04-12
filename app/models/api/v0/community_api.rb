module Api
	module V0
		class CommunityApi 
			def self.get_image community
				begin
				 	message = Google::Search::Image.new(:query => community, :image_type => :photo, :reusable => true).first.uri
				 	status = 200
				 rescue Exception => e
				 	status = 500
				 	message = e.to_s
				 end
				 {:message => message, :status => status}
			end
		end
	end
end