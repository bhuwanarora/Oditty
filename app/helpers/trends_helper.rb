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

		count = 0
	    neo = Neography::Rest.new 
	    clause = "MATCH (t:Trending) WHERE t.status=1 SET t.status=0 "
	    neo.execute_query clause

	    for trend in results
	      	trend_index = trend.downcase.gsub(" ", "").gsub("\"", "'").to_s rescue ""
	      	news = Google::Search::News.new(:query => trend).first
	      	if trend_index.present?
	        	big_clause = " MERGE (t"+count.to_s+":Trending{indexed_trending_topic:\""+trend_index+"\"}) ON CREATE SET t"+count.to_s+".status = 1, t"+count.to_s+".name=\""+trend+"\", t"+count.to_s+".timestamp="+Time.now.to_i.to_s+", t"+count.to_s+".title=\""+news.title.gsub("\"", "").to_s+"\", t"+count.to_s+".content=\""+news.content.gsub("\"", "").to_s+"\", t"+count.to_s+".url=\""+news.uri.to_s+"\", t"+count.to_s+".thumbnail_url=\""+news.thumbnail_uri.to_s+"\", t"+count.to_s+".location=\""+news.location.to_s+"\", t"+count.to_s+".publisher=\""+news.publisher.to_s+"\", t"+count.to_s+".redirect_url=\""+news.redirect_uri.to_s+"\" WITH t"+count.to_s
	      	end
			Google::Search::Book.new(:query => trend).each do |book|
				indexed_title = book.title.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\"", "")
				clause = " START book=node:node_auto_index('indexed_title:\""+indexed_title+"\"') CREATE UNIQUE (t"+count.to_s+")-[:RelatedBooks]->(book) "
				puts (big_clause + clause).blue.on_red
		    	neo.execute_query (big_clause + clause)
				puts ""
			end
	      
	      count = count + 1
	    end
	end

end