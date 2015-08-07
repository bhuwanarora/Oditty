class NewsSources::LiteratureAlltopNews < NewsSources

	def self.get_source
		@@source||= 'http://literature.alltop.com/'
	end

	def self.get_news_info_css
		css_string = [
					'ul.feed-block.ed9618c3cd10ae3c3d7b055c8ab69997 .hentry',
					'ul.feed-block[class~="2abc0f83d604e387aefe60fb06ed788a"] .hentry'
				]
	end

	def self.fetch_news_info date = nil
		if date.nil?
			date = TimeHelper.today
		end
		params = {
			:class => LiteratureAlltopNews,
			:date => date
		}
		news_array = LiteratureAlltopNews.fetch_news_data params
		output = news_array.map{|news| LiteratureAlltopNews.get_metadata(news)}
	end

	def self.get_date news_info
		time_string = news_info.css('.published').text
		date = TimeHelper.extract_month_name_based_dates(time_string)[0]
		date
	end

	def self.filter_news news_data
		news_data
	end

	def self.get_metadata news_info
		time = Constant::Time
		date = LiteratureAlltopNews.get_date news_info
		partial_news_link = (news_info.css('.entry-title a').attr('href').to_s.strip	rescue nil)
		complete_news_link = LiteratureAlltopNews.get_complete_news_link(partial_news_link, LiteratureAlltopNews.get_source) rescue nil
		image_url = LiteratureAlltopNews.scrape_content(complete_news_link).css('h1+ .center img').attr('src').to_s.strip rescue nil
		metadata = {
			"image_url" 	=> image_url,
			"title"			=> (news_info.css('.entry-title').text.strip	rescue nil),
			"description"	=> (news_info.css('.entry-bound').text.strip	rescue nil),
			"news_link"		=> complete_news_link,
			"region"		=> nil,
			time::Year		=> date[time::Year],
			time::Month 	=> date[time::Month],
			time::Date 		=> date[time::Date]
		}
		metadata
	end
end