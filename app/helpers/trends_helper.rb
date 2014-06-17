module TrendsHelper

	require 'nokogiri'
	require 'open-uri'

	def self.social_mention
		url = "http://socialmention.com/"
		doc = Nokogiri::HTML(open(url))
		trends = doc.css('.clearfix a')
		for trend in trends
			puts trend.children.text.green
		end
	end
end