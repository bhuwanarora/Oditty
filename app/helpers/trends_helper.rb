module TrendsHelper

	def self.social_mention
		count = 0
	    neo = Neography::Rest.new 

		@news_sources ||= self.get_news_sources
		for news_source in @news_sources
			news_links = self.get_news news_source["url"]
			
			for news_link in news_links
				tags = self.get_tags news_link
				self.set_tags_on_books tags 
			end
		end
	end

	def self.set_tags_on_books results
	    for trend in results
	    	begin
	        	big_clause = " MERGE (t"+count.to_s+":Trending{indexed_trending_topic:\""+trend_index+"\"}) ON CREATE SET t"+count.to_s+".searched_words = \""+trend.gsub("\"", "").to_s+"\", t"+count.to_s+".status = 1, t"+count.to_s+".name=\""+trend+"\", t"+count.to_s+".timestamp="+Time.now.to_i.to_s+", t"+count.to_s+".title=\""+news.title.gsub("\"", "").to_s+"\", t"+count.to_s+".content=\""+news.content.gsub("\"", "").to_s+"\", t"+count.to_s+".url=\""+news.uri.to_s+"\", t"+count.to_s+".publisher_thumb=\""+publisher_thumb.to_s+"\", t"+count.to_s+".thumbnail_url=\""+thumb.thumbnail_uri.to_s+"\", t"+count.to_s+".thumb=\""+thumb.uri.to_s+"\", t"+count.to_s+".location=\""+news.location.to_s+"\", t"+count.to_s+".publisher=\""+news.publisher.to_s+"\", t"+count.to_s+".redirect_url=\""+news.redirect_uri.to_s+"\" ON MATCH SET t"+count.to_s+".status = 1 WITH t"+count.to_s
				self.map_books_to_news trend
	    	rescue Exception => e
	    		
	    	end
	      count = count + 1
	    end
	end

	def self.get_news news_source
		news_links = []
		doc = Nokogiri::HTML(open(URI(news_source))).css('.esc .esc-lead-article-title a')
		for news_link in doc
			news_links << news_link["href"]
		end
		news_links
	end

	def self.get_news_sources
		@news_sources = []
		google_news_edition_url = "https://support.google.com/news/answer/40237?hl=en"
		doc = Nokogiri::HTML(open(google_news_edition_url)).css('.i a')
		for news_source in doc
			if (news_source.children.text =~ /^[a-zA-Z]+$/) == 0 and !news_source.nil?
				@news_sources << {"url" => news_source["href"], "region" => news_source.children.text}
			end
		end
		@news_sources
	end

	def self.get_tags news_link
		tags = []
		query = Constants::NLPService + news_link rescue debugger
		uri = URI(query)
		response = Net::HTTP.get(uri)
		response["social_tags"].each do |social_tag|
		if social_tag["importance"] == 1 then tags << social_tag["originalValue"] end
		tags
	end

	def self.map_news_to_book
		Google::Search::Book.new(:query => trend).each do |book|
			indexed_title = book.title.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\"", "")
			clause = " START book=node:node_auto_index('indexed_title:\""+indexed_title+"\"') MERGE (t"+count.to_s+")-[:RelatedBooks]->(book) "
			puts (big_clause + clause).blue.on_red
			begin
	    		neo.execute_query (big_clause + clause)
				puts ""
			rescue Exception => e
				puts e.to_s
			end
		end
	end

end