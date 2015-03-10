module TrendsHelper

	def self.social_mention
		@news_sources ||= self.get_news_sources
		for news_source in @news_sources
			news_links = self.get_news news_source["url"]
			
			for news_link in news_links
				tags = []
				 
				
				merge_clause = "MERGE (fresh_news:News{url:" + news_link.to_s + "}) WITH fresh_news MERGE (region:Region{name: " + news_source["region"].to_s + "})-[stale_relation:HasNews]->(stale_news)"
				with_clause = " WITH fresh_news, region, stale_relation, stale_news"
				optional_match_clause = " OPTIONAL MATCH (fresh_news)<-[relation:HasNews*1.." + Constants::UniqueNewsCount.to_s + "]-(region:Region)"

				create_conditional = " FOREACH(ignoreMe IN CASE WHEN relation is null THEN [1] ELSE [] END | MERGE (region)-[:HasNews]->(fresh_news)-[:HasNews]->(stale_news) DELETE stale_relation) RETURN ID(fresh_news)"
				clause = create_new_news_node = merge_clause + with_clause + optional_match_clause + create_conditional
				news_id = self.execute_query clause["data"][0].to_i
				tags_topics = self.get_tags news_link
				
				response["social_tags"].each do |social_tag|
					if social_tag["importance"] == 1 then tags << social_tag["originalValue"] end
				end

				if self.is_news_fresh news_id
					self.map_region_to_news(news_source["region"], news_id)
					self.map_news_with_topics(news_id, response["topics"]) 				
					self.map_tags_to_news(news_id, tags)
					self.map_tags_to_books(tags, news_link, news_source["region"])
				end 
			end
		end
	end

	def self.is_news_fresh
		clause = " MATCH (region:Region)-[:HasNews]->(news) WHERE ID(news) = " + news_id.to_s
		data = self.execute_query clause["data"][0]
		if data.blank?
			response = false
		else
			response = true
		end
		response
	end

	def self.map_news_with_topics news_id, topic
		merge_clause = " MERGE (topic:Topic{name:" + topic.to_s + "})<-[:HasTopic]-(news:News) WHERE ID(news) = " + news_id.to_s
		self.execute_query merge_clause
	end

	def self.map_region_to_news region, news_id
		merge_clause = " MERGE (region:Region{name:" + region.to_s + "})-[:HasNews]->(news:News) WHERE ID(news) = " + news_id.to_s
		self.execute_query merge_clause
	end

	def self.map_tags_to_news news_id, tags
		for tag in tags
			merge_clause = " MERGE (news)-[:HasTags]->(tag:Trending{name: " + tag.to_s + "}) WHERE ID(news) = " + news_id.to_s
			self.execute_query merge_clause
		end
	end

	def self.execute_query clause
		neo = Neography::Rest.new
		puts clause
		response = neo.execute_query clause	
	end

	def self.map_tags_to_books results, news_link, region
	    for trend in results
	    	begin
	        	merge_clause = " MERGE (t:Trending{name: " + trend.to_s + "}) ON CREATE SET t.status = 1, t.name = " +  trend.to_s + ", t.timestamp=" + Time.now.to_i.to_s + ", t.url = " + news_link.to_s + ", t.location = " + region.to_s + " ON MATCH SET t.status = 1 WITH t "
				self.map_books_to_news(merge_clause, trend)
	    	rescue Exception => e
	    		debugger
	    	end
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
		query = Constants::NLPService + news_link 
		uri = URI(query)
		response = Net::HTTP.get(uri)
	end

	def self.map_books_to_news merge_clause, tag
		Google::Search::Book.new(:query => trend).each do |book|
			indexed_title = book.title.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\"", "")
			map_clause = " START book=node:node_auto_index('indexed_title:\""+indexed_title+"\"') MERGE (t)-[:RelatedBooks]->(book) "
			puts (merge_clause + map_clause).blue.on_red
			begin
	    		self.execute_query (merge_clause + map_clause)
				puts ""
			rescue Exception => e
				puts e.to_s
			end
		end
	end
end