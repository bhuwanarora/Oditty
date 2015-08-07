class NewsSources::HuffingtonPostNews < NewsSources

	def self.get_source
		@@source||= 'http://www.huffingtonpost.com/news/literary-prizes/'
	end

	def self.get_news_info_css
		css_string = ['.no_border']
	end

	def self.fetch_news_info date = nil
		if date.nil?
			date = TimeHelper.today
		end
		params = {
			:class => HuffingtonPostNews,
			:date => date
		}
		news_array = HuffingtonPostNews.fetch_news_data params
		output = news_array.map{|news| HuffingtonPostNews.get_metadata(news)}
	end

	def self.get_date news_info
		time_string = news_info.css('ul li')[2].text.gsub('.','-')
		format = [Constant::Time::Month, Constant::Time::Date, Constant::Time::Year]
		date = TimeHelper.extract_hyphen_separated_dates(time_string, format)[0]
		date
	end

	def self.filter_news news_data
		news_data
	end

	def self.get_metadata news_info
		time = Constant::Time
		date = HuffingtonPostNews.get_date news_info
		partial_news_link = (news_info.css('ul li a').attr('href').to_s.strip	rescue nil)
		complete_news_link = HuffingtonPostNews.get_complete_news_link(partial_news_link, HuffingtonPostNews.get_source) rescue nil
		metadata = {
			"image_url" 	=> (news_info..css('.image_wrapper a img').attr('longdesc').to_s.strip	rescue nil),
			"title"			=> (news_info.css('h3 a').text.to_s.strip 		rescue nil),
			"description"	=> "",
			"news_link"		=> complete_news_link,
			"region"		=> nil,
			time::Year		=> date[time::Year],
			time::Month 	=> date[time::Month],
			time::Date 		=> date[time::Date]
		}
		metadata
	end
end