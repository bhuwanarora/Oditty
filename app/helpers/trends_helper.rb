module TrendsHelper

	require 'nokogiri'
	require 'open-uri'
	require 'google-search'

	def self.social_mention
		count = 0
	    neo = Neography::Rest.new 

		@news_sources ||= self.get_news_sources
		for news_source in @news_sources
			news_links = self.get_news news_source["url"]
			
			for news_link in news_links
				
				merge_clause = "MERGE (news:Trending), (region:Region)-[original_relation:From]->(trending_news)"
				where_clause = " WHERE region.name =" + news_link["region"].to_s + " AND news.url = " + news_link["url"].to_s
				with_clause_first = " WITH news, region, original_relation"
				optional_match_clause = " OPTIONAL MATCH (news)-[relation:From*1.." + Constants::UniqueNewsCount.to_s + "]->(region:Region)"
				with_clause_second = " WITH news, region, original_relation. relation"

				create_conditional = " CASE relation = NULL THEN [1] ELSE [] END AS dummyarray
				FOREACH (variable in dummyarray | MERGE (region)-[:From]->(news)-[:From]->(original_news) WITH relation DELETE relation  RETURN ID(news))"
				clause = create_new_news_node = merge_clause + where_clause + with_clause_first + optional_match_clause + with_clause_second + create_conditional
				news_id = neo.execute_query clause["data"][0]

				tags = self.get_tags news_link
				self.set_tags_on_news tags, news_id
				self.link_new_books tags 
			end
		end
	end

	def self.set_tags_on_news tags, news_id
		for social_tags in tags["social_tags"]
			social_tags.each do |social_tag|
				if social_tag["importance"] == 1
					merge_clause = " MERGE (news)-[:HasInformationOf]->(tag:Tag { value = " + social_tag["originalValue"] + "}) WHERE ID(news) = " + news_id.to_s
					neo.execute_query merge_clause
				end
			end
		end
	end

	def self.link_new_books(trend_id, keywords)
		neo = Neography::Rest.new 
		
		clause = "MATCH (t:Trending)-[r:RelatedBooks]->(:Book) WHERE ID(t)="+trend_id.to_s+" DELETE r SET t.searched_words = \""+keywords.to_s+"\""
		neo.execute_query clause

		big_clause = "MATCH (t:Trending) WHERE ID(t)="+trend_id.to_s+" WITH t"

		Google::Search::Book.new(:query => keywords).each do |book|
			indexed_title = book.title.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\"", "").to_s
			clause = " START book=node:node_auto_index('indexed_title:\""+indexed_title+"\"') CREATE UNIQUE (t)-[:RelatedBooks]->(book) "
			puts (big_clause + clause).blue.on_red
			begin
	    		neo.execute_query (big_clause + clause)
				puts ""
			rescue Exception => e
				puts e.to_s
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
		query = Constants::NLPService + news_link rescue debugger
		uri = URI(query)
		response = Net::HTTP.get(uri)
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