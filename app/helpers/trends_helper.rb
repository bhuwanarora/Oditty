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
		big_clause = ""
		count = 0
	    for trend in results
	      trend_index = trend.downcase.gsub(" ", "").gsub("\"", "'").to_s rescue ""
	      if trend_index.present?
	        clause = " MERGE (t"+count.to_s+":Trending{indexed_trending_topic:\""+trend_index+"\"}) ON CREATE SET t"+count.to_s+".name=\""+trend+"\", t"+count.to_s+".timestamp="+Time.now.to_i.to_s
	        big_clause = big_clause + clause
	      end
	      # trend_url = "https://www.google.co.in/#q="+trend_index.gsub(" ", "+")+"&tbm=bks"
	      # doc = Nokogiri::HTML(open(trend_url))
	      # isbn = doc.css("._Ed")[0].content.split("isbn=")[1]
	      
	      count = count + 1
	    end
	    puts big_clause.blue.on_red
	    neo = Neography::Rest.new
	    neo.execute_query big_clause
	end
end