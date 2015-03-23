module TrendsHelper

	def self.social_mention
		@neo = Neography::Rest.new
		@news_sources ||= self.get_news_sources
		for news_source in @news_sources
			news_links = self.get_news news_source["url"]
			
			for news_link in news_links
				tags = []
				 
				
				merge_clause = "MERGE (fresh_news:News{url:" + news_link.to_s + "}) WITH fresh_news MERGE (region:Region{name: " + news_source["region"].to_s + "})-[stale_relation:HasNews]->(stale_news)"
				with_clause = " WITH fresh_news, region, stale_relation, stale_news"
				optional_match_clause = " OPTIONAL MATCH (fresh_news)<-[relation:HasNews*1.." + Constants::UniqueNewsCount.to_s + "]-(region:Region)"

				create_conditional = " FOREACH(ignoreMe IN CASE WHEN relation IS NULL THEN [1] ELSE [] END | MERGE (region)-[:HasNews]->(fresh_news)-[:HasNews]->(stale_news) DELETE stale_relation) RETURN ID(fresh_news) as news_id"
				clause = merge_clause + with_clause + optional_match_clause + create_conditional
				news_id = @neo.execute_query clause["news_id"][0]
				tags_topics = self.get_tags news_link
				
				response["social_tags"].each do |social_tag|
					if social_tag["importance"] == Constants::RelevantSocialTagValue then tags << social_tag["originalValue"] end
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

	def self.is_news_fresh news_id
		clause = " MATCH (region:Region)-[relation:HasNews]->(news) WHERE ID(news) = " + news_id.to_s + " RETURN ID(relation) as relation_id"
		data = (self.execute_query clause)["relation_id"][0]
		if data.blank?
			is_news_fresh = false
		else
			is_news_fresh = true
		end
		is_news_fresh
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
		      	trend_index = trend.downcase.gsub(" ", "").gsub("\"", "'").to_s rescue ""
		      	news = Google::Search::News.new(:query => trend).first
		      	if news.present?
			      	thumb = Google::Search::Image.new(:query => trend).first
			      	publisher_thumb = Google::Search::Image.new(:query => news.publisher.to_s).first.thumbnail_uri rescue ""
			      	if trend_index.present?
			        	big_clause = " MERGE (t"+count.to_s+":Trending{indexed_trending_topic:\""+trend_index+"\"}) ON CREATE SET t"+count.to_s+".searched_words = \""+trend.gsub("\"", "").to_s+"\", t"+count.to_s+".status = 1, t"+count.to_s+".name=\""+trend+"\", t"+count.to_s+".timestamp="+Time.now.to_i.to_s+", t"+count.to_s+".title=\""+news.title.gsub("\"", "").to_s+"\", t"+count.to_s+".content=\""+news.content.gsub("\"", "").to_s+"\", t"+count.to_s+".url=\""+news.uri.to_s+"\", t"+count.to_s+".publisher_thumb=\""+publisher_thumb.to_s+"\", t"+count.to_s+".thumbnail_url=\""+thumb.thumbnail_uri.to_s+"\", t"+count.to_s+".thumb=\""+thumb.uri.to_s+"\", t"+count.to_s+".location=\""+news.location.to_s+"\", t"+count.to_s+".publisher=\""+news.publisher.to_s+"\", t"+count.to_s+".redirect_url=\""+news.redirect_uri.to_s+"\" ON MATCH SET t"+count.to_s+".status = 1 WITH t"+count.to_s
			      	end
					self.map_books_to_news trend
				end
	    	rescue Exception => e
	    		
	    	end
	      count = count + 1
	    end
	end

	def self.map_books_to_news
		Google::Search::Book.new(:query => trend).each do |book|
			indexed_title = book.title.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\"", "")
			clause = " START book=node:node_auto_index('indexed_title:\""+indexed_title+"\"') CREATE UNIQUE (t"+count.to_s+")-[:RelatedBooks]->(book) "
			puts (big_clause + clause).blue.on_red
			begin
	    		neo.execute_query (big_clause + clause)
				puts ""
			rescue Exception => e
				puts e.to_s
			end
		end
	end

	def self.link_new_books(trend_id, keywords)
		neo = Neography::Rest.new 
		
		clause = "MATCH (t:Trending)-[r:RelatedBooks]->(:Book) WHERE ID(t)="+trend_id.to_s+" DELETE r SET t.searched_words = \""+keywords.to_s+"\""
		neo.execute_query clause
	end
	
	def self.get_news_sources
		@news_sources = []
		google_news_edition_url = Rails.Application.config.google_news_sources
		doc = Nokogiri::HTML(open(google_news_edition_url)).css('.i a')
		for news_source in doc
			if (news_source.children.text =~ /^[a-zA-Z]+$/) == 0 and !news_source.nil?
				@news_sources << {"url" => news_source["href"], "region" => news_source.children.text}
			end
		end
		@news_sources
	end

	def self.get_tags news_link
		query = Rails.application.config.nlp_ervice + "/api/v0?q=" + news_link 
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