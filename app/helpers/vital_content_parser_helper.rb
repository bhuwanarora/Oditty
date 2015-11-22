module VitalContentParserHelper
	require 'nokogiri'
  	require 'open-uri'

  	url = "https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Expanded/People"
  	doc = Nokogiri::HTML(open(url))
  	doc.css('.column-count-3 li a').each do |item|
  		content = item.content
  		puts "#{content}"
  	end

  	doc.css('.mw-headline').each do |item|
  		content = item.content
  		puts "#{content}"
  	end
end