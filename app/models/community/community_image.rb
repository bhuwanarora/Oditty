class Community::CommunityImage < Community
	def initialize name
		@name = name
	end

	def get_image 
	 	Google::Search::Image.new(:query => @name, :image_type => :photo, :reusable => true).first.uri
	end
end