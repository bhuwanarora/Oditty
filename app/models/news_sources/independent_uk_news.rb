class NewsSources::IndependentUkNews < NewsSources

	def self.get_source
		@@source||= 'http://www.independent.co.uk/topic/Literature'
	end

	def self.get_news_info_css
		css_string = ['.inpage-widget-6246015 .news']
	end

	def self.fetch_news_info date = nil
		if date.nil?
			date = TimeHelper.today
		end
		params = {
			:class => IndependentUkNews,
			:date => date
		}
		news_array = IndependentUkNews.fetch_news_data params
		output = news_array.map{|news| IndependentUkNews.get_metadata(news)}
	end

	def self.get_date news_info
		time_string = news_info.css('.dateline').text
		date = TimeHelper.extract_month_name_based_dates(time_string)[0]
		date
	end

	def self.filter_news news_data
		news_data
	end

	def self.get_metadata news_info
		time = Constant::Time
		date = IndependentUkNews.get_date news_info
		partial_news_link = (news_info.css('a').attr('href').to_s.strip	rescue nil)
		complete_news_link = IndependentUkNews.get_complete_news_link(partial_news_link, IndependentUkNews.get_source) rescue nil
		metadata = {
			"image_url" 	=> (news_info.css('img').attr('src').to_s.strip	rescue nil),
			"title"			=> (news_info.css('a').text.to_s.strip 			rescue nil),
			"description"	=> (news_info.css('p')[1].text.to_s.strip 		rescue nil),
			"news_link"		=> complete_news_link,
			"region"		=> nil,
			time::Year		=> date[time::Year],
			time::Month 	=> date[time::Month],
			time::Date 		=> date[time::Date]
		}
		metadata
	end
end