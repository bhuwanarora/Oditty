module TrendsHelper

	require 'nokogiri'
	require 'open-uri'

	def self.social_mention
		url = "http://socialmention.com/"
		doc = Nokogiri::HTML(open(url))
		trends = doc.css('.clearfix a')
		results = []
		for trend in trends
			results.push trend.children.text
		end
		results
	end
end