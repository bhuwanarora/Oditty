class News < Neo
	def initialize id
		@id = id
	end

	def self.get_news
		" MATCH (news)-[:TimeStamp]->(time)-[:FromDay]->(day:Day)<-[:Has_day]-(month:Month)<-[:Has_month]-(year:Year)  "
	end

	def self.match_chronological_news
		News.match_day + " WITH news AS current, day AS today " + News.match_chronological_days_path(1) + ", current, " + News.extract_unwind("day") + ", current" + News.match_day + ", current , ABS(TOINT(news.created_at - current.created_at*1.0)) AS deviation ORDER BY deviation LIMIT " + Constant::Count::NewsShownInCommunity.to_s + " WITH news ORDER BY news.created_at "
	end

	def self.match_chronological_days_path length
		" MATCH path = (next_days:Day)<-[:NextDay*#{length}]-(today:Day)<-[:NextDay*#{length}]-(last_days:Day) WITH path "
	end

	def match
		" MATCH (news:News) WHERE ID(news) = " + @id.to_s + " WITH news "
	end

	def self.match_community
		" MATCH (news)-[:HasCommunity]->(community:Community) WITH news, community "
	end

	def match_community
		" MATCH (news)-[:HasCommunity]->(community:Community) WITH news, community "
	end

	def self.merge news_metadata
		" MERGE (news:News{url:\"" + news_metadata["news_link"].to_s + "\"}) ON CREATE SET news.active = true, news.created_at = " + Time.now.to_i.to_s + ", news.view_count = 0 " +  News.set_metadata(news_metadata) + " WITH news "
	end

	def self.merge_region news_metadata
		" MERGE (region:Region{name:\"#{news_metadata["region"]}\"}) MERGE (region)<-[:FromRegion{region:ID(region)}]-(news) WITH region, news " 
	end

	def self.create news_metadata
		clause  = News.merge(news_metadata) + News.merge_timestamp  + News.merge_region(news_metadata) + News.return_init + " ID(news) as news_id "
		(clause.execute)[0]["news_id"]
	end

	def self.merge_timestamp
		" MATCH (year:Year{year:#{Time.now.year}})-[:Has_month]->(month:Month{month: #{Time.now.month}})-[:Has_day]->(day:Day{day:#{Time.now.day}}) MERGE (time:TimePeriod{quarter:\"#{(Time.now.hour / 6) * 6}-#{((Time.now.hour / 6)+1) * 6}\"})-[:FromDay]->(day) MERGE (news)-[:TimeStamp]->(time) WITH news "
	end

	def self.set_indexed_title title
		" SET news.indexed_title = \"" + title.to_s.search_ready + "\" "
	end

	def self.set_metadata news_metadata
		clause = ""
		news_metadata.each do |key, value|
			unless key == "news_link" || key == "available" || key == "region" 
				clause += " SET news." + key + " = \"" + value.to_s.database_ready + "\" " 
			end
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

	def self.match_day_path length = Constant::Count::NewsFromDays-1
		" MATCH path = (today:Day)<-[:NextDay*#{length}]-(last_days:Day) WITH path "
	end

	def self.match_day
		" MATCH (day:Day)<-[:FromDay]-(:TimePeriod)<-[:TimeStamp]-(news:News) WITH day, news"
	end

	def self.match_time_period day_skip_count
		" MATCH (year:Year{year:#{Time.now.year}})-[:Has_month]->(month:Month{month:#{Time.now.month}})-[:Has_day]->(:Day{day:#{Time.now.day}})<-[:NextDay*#{day_skip_count}]-(day:Day) WITH day AS today " + News.match_day_path + ", " + News.extract_unwind("day") + News.match_day
	end

	def self.define_label
		" news :News "
	end

	def self.order_desc
		" ORDER BY  TOINT(news.created_at) DESC "
	end

	def self.get_feed skip_count, day_skip_count
		News.match_time_period(day_skip_count) + " WHERE news.active = true WITH news " + News.order_desc + News.skip(skip_count) + News.limit(Constant::Count::NewsShownInFeed) + News.match_community + " WITH news," + News.collect_map({"communities" => Community.grouped_basic_info}) + News.return_group(News.basic_info,"communities") 
	end
end