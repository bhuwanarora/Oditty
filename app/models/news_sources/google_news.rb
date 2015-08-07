class NewsSources::GoogleNews < NewsSources
	def self.fetch_news_info
		news_metadata_array = []
		news_sources = NewsHelper.fetch_news_sources
		for news_source in news_sources
			news_links = NewsHelper.fetch_news news_source["url"]
			puts news_links
			for news_link in news_links
				news_metadata = {}
				puts news_link
				news_metadata = News.get_metadata news_link
				news_metadata["news_link"] = news_link
				news_metadata["region"] = news_source["region"]
				news_metadata_array << news_metadata
			end
		end
		news_metadata_array
	end
end