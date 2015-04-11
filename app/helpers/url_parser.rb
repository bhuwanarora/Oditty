module UrlParser
	
	def self.get_metadata url
		og = OpenGraph.new(url)
		og
	end
end