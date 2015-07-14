class News < Neo
	def initialize id
		@id = id
	end

	def add_notification
		match + Community.match_news + UsersCommunity.match + ", news WITH DISTINCT user, news " + User::UserNotification.add("news") + News.return_init + News.basic_info
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
		" MATCH (news)-[has_community:HasCommunity]->(community:Community) WITH news, community, has_community "
	end

	def self.optional_match_community
		" MATCH (news)-[has_community:HasCommunity]->(community:Community) WITH news, community, has_community "
	end


	def match_community
		" MATCH (news)-[:HasCommunity]->(community:Community) WITH news, community "
	end

	def self.merge news_metadata
		" MERGE (news:News{url:\"" + news_metadata["news_link"].to_s + "\"}) ON CREATE SET news.created_at = " + Time.now.to_i.to_s + ", news.view_count = 0 " +  News.set_metadata(news_metadata) + ", news.status = true WITH news "
	end

	def self.merge_region news_metadata
		if news_metadata["region"].strip == "Canada English"
			news_metadata["region"] = "Canada"
		end
		" MERGE (region:Region{name:\"#{news_metadata["region"]}\"}) MERGE (region)<-[:FromRegion{region:ID(region)}]-(news) SET region.news_count = COALESCE(region.news_count) + 1 WITH region, news " 
	end

	def self.create news_metadata
		News.merge(news_metadata) + News.match_timestamp  + News.merge_region(news_metadata) + News.return_init + " ID(news) as news_id "
	end

	def self.match_timestamp
		" MATCH (year:Year{year:#{Time.now.year}})-[:Has_month]->(month:Month{month:#{Time.now.month}})-[:Has_day]->(day:Day{day:#{Time.now.day}}) MERGE (time:TimePeriod{quarter:\"#{(Time.now.hour / 6) * 6}-#{((Time.now.hour / 6)+1) * 6}\"})-[:FromDay]->(day) MERGE (news)-[:TimeStamp]->(time) WITH news "
	end

	def self.match
		" MATCH (news:News) WITH news "
	end

	def set_view_count
		match + " SET news.view_count = COALESCE(news.view_count,0) + 1 "
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

#{relevance: "+ relevance['relevance'].to_s+",relevanceOriginal:"+relevance['relevanceOriginal'].to_s+"}
	def self.merge_community relevance, news = 'news'
		clause = " MERGE (" + news + ")-[h:HasCommunity]->(community)"\
		" ON CREATE SET h +={relevance: "+ relevance['relevance'].to_s+",relevanceOriginal:"+relevance['relevanceOriginal'].to_s+"}"\
		" ON MATCH  SET h +={relevance: "+ relevance['relevance'].to_s+",relevanceOriginal:"+relevance['relevanceOriginal'].to_s+"}"\
		" WITH "+ news + ",community"
		clause
	end

	
	def get_basic_info
		match + News.return_group(News.basic_info)
	end

	def self.basic_info
		" ID(news) AS  id, news.url  AS url, news.image_url AS image_url, news.title AS title, news.description AS description, news.created_at AS created_at, labels(news) AS label, COALESCE(news.bookmark_count,0) AS bookmark_count, news.view_count AS view_count"
	end

	def self.grouped_basic_info
		" news_id: ID(news) , news_url: news.url, view_count:news.view_count, title: news.title , description: news.description  , image_url: news.image_url, created_at:news.created_at, bookmark_count: COALESCE(news.bookmark_count,0) "
	end

	def self.match_day
		" MATCH (day:Day)<-[:FromDay]-(:TimePeriod)<-[:TimeStamp]-(news:News) WITH day, news"
	end

	def self.match_time_period day_skip_count
		if day_skip_count == 0
			clause = " MATCH (year:Year{year:#{Time.now.year}})-[:Has_month]->(month:Month{month:#{Time.now.month}})-[:Has_day]->(day:Day{day:#{Time.now.day}}) WITH day " + News.match_day
		else
			clause = " MATCH (year:Year{year:#{Time.now.year}})-[:Has_month]->(month:Month{month:#{Time.now.month}})-[:Has_day]->(:Day{day:#{Time.now.day}})<-[:NextDay*#{day_skip_count}]-(day:Day) WITH day "  + News.match_day
		end
		clause
	end

	def self.match_day_for time
		" MATCH (news:News)-[:TimeStamp]->()-[:FromDay]->(day:Day{day:#{time.day}})<-[:Has_day]-(month:Month{month: #{time.month}})<-[:Has_month]-(year:Year{year:#{time.year}}) WITH day, month, year, news "
	end

	def self.define_label
		" news :News "
	end

	def self.order_desc
		" ORDER BY TOINT(news.created_at) DESC "
	end

	def self.match_region region
		if region
			clause = " MATCH (news)-[:FromRegion]->(region:Region) WHERE ID(region) = " + region.to_s + " WITH news, region "
		else
			clause = ""
		end
		clause
	end

	def self.match_regional_temporal_news skip_count, day_skip_count, region
		News.match_time_period(day_skip_count) + " WHERE news.status = true WITH news " + News.match_region(region) + News.order_desc + News.skip(skip_count) + News.limit(Constant::Count::NewsShownInFeed)
	end

	def self.match_community_users
		News.match_community + UsersCommunity.optional_match + ", news " + " WITH DISTINCT news, user WITH news , " + News.collect_map({"users" => User.grouped_primary_display_info}) + " WITH DISTINCT news, users  " + News.match_community + ", users ORDER BY has_community.relevance DESC WITH users, news,  " + News.collect_map({"communities" => Community.grouped_basic_info}) + ", SUM(community.follow_count) AS follow_count WITH news, users, communities, follow_count " 
	end

	def self.get_feed skip_count, day_skip_count, region
		 News.match_regional_temporal_news(skip_count, day_skip_count, region) + News.match_community_users + News.return_group(News.basic_info, "follow_count", "communities[0.." + Constant::Count::CommunitiesOfNewsShown.to_s + "] AS communities ", "users[0..4] AS users")
	end

	def self.get_regions
		" MATCH (region:Region) WITH region ORDER BY region.name RETURN COLLECT({id:ID(region), name:region.name, news_count:region.news_count }) AS regions "
	end

	def self.get_popular_news_from_last_week
		News.match_community + " WHERE ("+Time.now.to_i.to_s+" - news.created_at)/86400 < 7 " + News.return_group(News.basic_info, News.collect_map({"communities" => Community.grouped_basic_info}), "community.count AS communities_count") + News.order_init + " communities_count DESC " + News.limit(4)
	end

	def self.match_popular_news_from_last_week
		News.match + " WHERE ("+Time.now.to_i.to_s+" - news.created_at)/86400 < 1 WITH news "
	end
end