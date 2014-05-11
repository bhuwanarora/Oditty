module QuotesCrawler
	require 'nokogiri'
  	require 'open-uri'

  	def self.parse
  		url = "http://www.forbes.com/sites/kevinkruse/2013/05/28/inspirational-quotes/"
  		doc = Nokogiri::HTML(open(url))
  		quotes = doc.css('.contains_vestpocket li')
  		quotes.each do |quote|
  			data = quote.content.split("–")
  			ComingSoonPageQuotes.find_or_create_by(:quote => data[0], :author => data[1])
  		end
  	end
end