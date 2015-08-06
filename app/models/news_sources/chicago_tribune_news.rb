class NewsSources::ChicagoTribuneNews < NewsSources
	def self.get_source
		@@source||= 'http://www.chicagotribune.com/lifestyles/books/'
	end

	def self.get_news_info_css
		css_string = '.trb_outfit_primaryItem'
	end

	def self.fetch_news_info date = nil
		if date.nil?
			date = TimeHelper.today
		end
		params = {
			:class => ChicagoTribuneNews,
			:date => date
		}
		news_array = ChicagoTribuneNews.fetch_news_data params
		output = news_array.map{|news| ChicagoTribuneNews.get_metadata(news)}
	end

	def self.get_date news_info
		time_container = news_info.css('.trb_outfit_primaryItem_article .trb_outfit_categorySectionHeading_date')
		time_string = time_container.attr("data-datetime-monthshort").to_s.strip.gsub(".","") + " " + time_container.attr("data-datetime-day").to_s.strip + " " + time_container.attr("data-datetime-year").to_s.strip
		date = TimeHelper.extract_month_name_based_dates(time_string)[0]
		date
	end

	def self.filter_news news_data
		news_data
	end

	def self.get_metadata news_info
		time = Constant::Time
		date = ChicagoTribuneNews.get_date news_info
		partial_news_link  = news_info.attr('data-content-url').to_s.strip rescue nil
		complete_news_link = ChicagoTribuneNews.get_complete_news_link(partial_news_link, ChicagoTribuneNews.get_source) rescue nil
		metadata = {
			"image_url" 	=> (news_info.attr('data-content-thumbnail').to_s.strip	rescue nil),
			"title"			=> (news_info.attr('data-content-title').to_s.strip		rescue nil),
			"description"	=> (news_info.css('.trb_outfit_primaryItem_article_content_text').text.to_s.strip	rescue nil),
			"news_link"		=> complete_news_link,
			"region"		=> nil,
			time::Year		=> date[time::Year],
			time::Month 	=> date[time::Month],
			time::Date 		=> date[time::Date]
		}
		metadata
	end

end