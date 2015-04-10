class News < Neo
	def initialize id
		@id = id
	end

	def self.match_chronological_news
		News.match_path_bidirectionally(Constants::CommunitiesShown) + News.extract_unwind("linked_news") + ", news, ABS(TOINT(linked_news.created_at - news.created_at*1.0)) AS deviation ORDER BY deviation LIMIT " + Constants::NewsShownInCommunityCount.to_s + " WITH linked_news AS news ORDER BY news.created_at "
	end

	def self.match_path skip_count  
		" MATCH path = (news)-[:RegionalNews*" + skip_count.to_s + "]->(next_news) WITH news, path "
	end

	def match
		" MATCH (news:News) WHERE ID(news) = " + @id.to_s + " WITH news "
	end

	def self.match_path_bidirectionally skip_count
		" MATCH path = (news)-[:RegionalNews*" + skip_count.to_s + "]-(next_news) WITH news, path "
	end

	def self.match_community
		" MATCH (news:News)-[:HasCommunity]->(community:Community) WITH news, community "
	end

	def match_community
		" MATCH (news)-[:HasCommunity]->(community:Community) WITH news, community "
	end

	def self.merge news_link
		" MERGE (news:News{url:\"" + news_link.to_s + "\"}) ON CREATE SET news.created_at = " + Time.now.to_i.to_s + " WITH news "
	end

	def self.merge_region news_source
		" MERGE (region:Region{name: \"" + news_source["region"].to_s + "\"}) WITH region " 
	end

	def self.optional_match_regional_news
		"OPTIONAL MATCH (region)-[old:RegionalNews{region:ID(region)}]->(old_news) WITH region, old, old_news "
	end

	def self.optional_match_news
		" OPTIONAL MATCH (news)-[relation:RegionalNews{region:ID(region)}]-()"
	end

	def self.create_news_link
		" FOREACH(ignoreMe IN CASE WHEN relation IS NULL AND old IS NOT NULL THEN [1] ELSE [] END | MERGE (region)-[:RegionalNews{region:ID(region)}]->(news)-[:RegionalNews{region:ID(region)}]->(old_news) DELETE old) FOREACH(ignoreMe IN CASE WHEN relation IS NULL AND old IS  NULL THEN [1] ELSE [] END | MERGE (region)-[:RegionalNews{region:ID(region)}]->(news))  "
	end

	def self.create news_link, news_source
		clause  = News.merge(news_link) + News.merge_region(news_source) + ", news " + News.optional_match_regional_news +  ", news " + News.optional_match_news + News.create_news_link + News.return_init + " ID(news) as news_id "
		(clause.execute)[0]["news_id"]
	end

	def self.handle
		news_sources ||= self.fetch_news_sources
		puts news_sources
		for news_source in news_sources
			
			news_links = self.fetch_news news_source["url"]
			puts news_links
			for news_link in news_links
				puts news_link
				Community.create news_link, news_source
			end
		end
	end

	def self.news_already_present news_id
		clause = " MATCH (region:Region)-[relation:RegionalNews{region:ID(region)}]->(news) WHERE ID(news) = " + news_id.to_s + " RETURN ID(relation) as relation_id "
		data = (clause.execute)[0]
		if data.blank?
			news_already_present = false
		else
			news_already_present = true
		end
		news_already_present
	end

	def self.map_topics news_id, topics
		topics.each do |topic|
			clause = News.new(news_id).match + " MERGE (topic:Topic{name:\"" + topic["value"].to_s + "\"})  MERGE (topic)<-[:HasTopic]-(news) "
			clause.execute
		end
	end

	def self.fetch_news news_source
		news_links = []
		doc = Nokogiri::HTML(open(URI(news_source))).css('.esc .esc-lead-article-title a')
		for news_link in doc
			news_links << news_link["href"]
		end
		news_links
	end

	def self.fetch_news_sources
		news_sources = []
		google_news_edition_url = Rails.application.config.google_news_sources
		doc = Nokogiri::HTML(open(google_news_edition_url)).css('.i a')
		for news_source in doc
			if (news_source.children.text =~ /^[a-zA-Z]+$/) == 0 and !news_source.nil?
				news_sources << {"url" => news_source["href"], "region" => news_source.children.text}
			end
		end
		news_sources
	end

	def self.fetch_tags news_link
		query = Rails.application.config.nlp_service + "api/v0/parser?q=" + news_link 
		puts query
		uri = URI(query)
		response = Net::HTTP.get(uri)
	end
end
