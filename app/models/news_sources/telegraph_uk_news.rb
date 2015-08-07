class NewsSources::TelegraphUkNews < NewsSources
	def self.get_source
		@@source||= 'http://www.telegraph.co.uk/culture/books/booknews/'
	end

	def self.get_news_info_css
		css_string = ['.headlineImageCentre']
	end

	def self.fetch_news_info date = nil
		if date.nil?
			date = TimeHelper.today
		end
		params = {
			:class => TelegraphUkNews,
			:date => date
		}
		news_array = TelegraphUkNews.fetch_news_data params
		output = news_array.map{|news| TelegraphUkNews.get_metadata(news)}
	end

	def self.get_date news_info
		time_string = news_info.css('.dateCC').text
		date = TimeHelper.extract_month_name_based_dates(time_string)[0]
		date
	end

	def self.filter_news news_data
		output = []
		news_data.each do |news|
			if news.css('.labelAbstract .labelOnSec').text.to_s.strip.capitalize == 'Book news'
				output << news
			end
		end
		output
	end

	def self.get_metadata news_info
		time = Constant::Time
		date = TelegraphUkNews.get_date news_info
		partial_news_link  = news_info.css('h3 a').attr('href').to_s.strip rescue nil
		complete_news_link = TelegraphUkNews.get_complete_news_link(partial_news_link, TelegraphUkNews.get_source) rescue nil
		metadata = {
			"image_url" 	=> (news_info.css('img').attr('src').to_s.strip			rescue nil),
			"title"			=> (news_info.css('h3 a').text.to_s.strip				rescue nil),
			"description"	=> (news_info.css('.labelAbstract p').text.to_s.strip	rescue nil),
			"news_link"		=> complete_news_link,
			"region"		=> nil,
			time::Year		=> date[time::Year],
			time::Month 	=> date[time::Month],
			time::Date 		=> date[time::Date]
		}
		metadata
	end
end
