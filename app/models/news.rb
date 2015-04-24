class News < Neo
	def initialize id
		@id = id
	end

	def self.get_news
		" MATCH (news)-[:TimeStamp]->(time)-[:FromDay]->(day:Day)<-[:Has_day]-(month:Month)<-[:Has_month]-(year:Year)  "
	end

	def self.match_chronological_news
		News.match_path_bidirectionally(Constant::Count::CommunitiesShown) + ", " + News.extract_unwind("linked_news") + ", news, ABS(TOINT(linked_news.created_at - news.created_at*1.0)) AS deviation ORDER BY deviation LIMIT " + Constant::Count::NewsShownInCommunity.to_s + " WITH linked_news AS news ORDER BY news.created_at "
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
		" MATCH (news)-[:HasCommunity]->(community:Community) WITH news, community "
	end

	def match_community
		" MATCH (news)-[:HasCommunity]->(community:Community) WITH news, community "
	end

	def self.merge news_metadata
		" MERGE (news:News{url:\"" + news_metadata["news_link"].to_s + "\"}) ON CREATE SET news.created_at = " + Time.now.to_i.to_s + ", news.view_count = 0 " +  News.set_metadata(news_metadata) + " WITH news "
	end

	def self.merge_region region
		" MERGE (region:Region{name: \"" + region.to_s + "\"}) WITH region " 
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

	def self.create news_metadata
		clause  = News.merge(news_metadata) + News.merge_timestamp  + News.merge_region(news_metadata["region"]) + ", news " + News.optional_match_regional_news +  ", news " + News.optional_match_news + News.create_news_link + News.return_init + " ID(news) as news_id "
		(clause.execute)[0]["news_id"]
	end

	def self.merge_timestamp
		" MERGE (year:Year{year:#{Time.now.year}}) MERGE (month:Month{month: #{Time.now.month}})<-[:Has_month]-(year) MERGE (day:Day{day:#{Time.now.day}})<-[:Has_day]-(month) MERGE (time:TimePeriod{quarter:\"#{(Time.now.hour / 6) * 6}-#{((Time.now.hour / 6)+1) * 6}\"})-[:FromDay]->(day) MERGE (news)-[:TimeStamp]->(time) WITH news "
	end

	def self.set_indexed_title title
		" SET news.indexed_title = \"" + title.to_s.search_ready + "\" "
	end

	def self.set_metadata news_metadata
		clause = ""
		news_metadata.delete("available").delete("news_link").delete("region")
		news_metadata.each do |key, value|
			clause += " SET news." + key + " = \"" + value.to_s.gsub("\"","\\\"").gsub("\'","\\\'") + "\" " 
		end
		clause + News.set_indexed_title(news_metadata["title"]) + News.set_search_index(news_metadata["title"])
	end

	def self.set_search_index title
		" SET news.search_index = \"" + title.to_s.search_ready + "\" "
	end

	def self.get_metadata news_link
		news_metadata = {}
		news_metadata["available"] = false
		begin
			news_data = Nokogiri::HTML(open(news_link))
			if news_data.css("meta[property='og:title']").present?
				news_metadata["title"] = news_data.css("meta[property='og:title']").first.attributes["content"]
			end
			if news_data.css("meta[property='og:image']").present?
				news_metadata["image_url"] = news_data.css("meta[property='og:image']").first.attributes["content"]
			end

			if news_data.css("meta[property='description']").present?
				news_metadata["description"] = news_data.css("meta[property='description']").first.attributes["content"]
			elsif news_data.css("meta[property='og:description']").present?
				news_metadata["description"] = news_data.css("meta[property='og:description']").first.attributes["content"]
			end
			if news_metadata["title"].present? and news_metadata["description"].present?   
				news_metadata["available"] = true
			end
		rescue Exception => e
			puts e.to_s.red
			news_metadata["available"] = false
		end
		puts news_metadata.to_s.green
		news_metadata
	end


	def self.merge_community
		" MERGE (news)-[:HasCommunity]->(community) WITH news, community "
	end

	def self.handle
		news_sources ||= self.fetch_news_sources
		puts news_sources
		for news_source in news_sources
			
			news_links = self.fetch_news news_source["url"]
			puts news_links
			for news_link in news_links
				news_metadata = {}
				puts news_link
				news_metadata = News.get_metadata news_link
				news_metadata["news_link"] = news_link
				news_metadata["region"] = news_source["region"]
				Community.create news_metadata
			end
		end
	end

	def match_region
		" MATCH (region:Region)-[regional_news:RegionalNews{region:ID(region)}]->(news) WHERE ID(news) = " + @id.to_s + " WITH region, news  "
	end

	def self.news_already_present news_id
		clause = News.new(news_id).match_region + " , regional_news " + News.return_init + " ID(regional_news) AS regional_news " 
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

	def self.basic_info
		" ID(news) AS  id  ,news.url  AS url , news.image_url AS image_url, news.title AS title, news.description AS description, news.created_at AS created_at "
	end

	def self.grouped_basic_info
		" news_id: ID(news) , news_url: news.url, view_count:news.view_count, title: news.title , description: news.description  , image_url: news.image_url, created_at:news.created_at "
	end

	def self.match_day
		" MATCH (news:News)-[:TimeStamp]->()-[:FromDay]->(day:Day{day:#{Time.now.day}})<-[:Has_day]-(month:Month{month: #{Time.now.month}})<-[:Has_month]-(year:Year{year:#{Time.now.year}}) WITH day, month, year, news "
	end

	def self.define_label
		" news :News "
	end

	def self.order_desc
		" ORDER BY  TOINT(news.created_at) DESC "
	end

	def self.get_feed skip_count=0
		News.match_day + News.match_community + " WITH news," + News.collect_map({"communities" => Community.grouped_basic_info}) + News.order_desc + News.skip(skip_count) + News.limit(Constant::Count::NewsShownInFeed) + News.return_group(News.basic_info,"communities") 
	end
end
