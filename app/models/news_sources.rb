class NewsSources < Neo

	def self.fetch_news_data params
		news_data = NewsSources.fetch_raw_data params
		debugger
		filtered_news_data = NewsSources.filter_news_on_date news_data, params
		filtered_news_data = params[:class].filter_news filtered_news_data
	end

	def self.format_news_data news_info_array, className
		news_info_array.map{|news_info| className.get_metadata(news_info)}
	end

	def self.fetch_news params
		news_info_array = NewsSources.fetch_news_data
		output = NewsSources.format_news_data news_info_array, params[:class]
	end

	def self.fetch_raw_data params
		clas = params[:class]
		date = params[:date]
		css_string = clas.get_news_info_css
		source_url = clas.get_source
		doc =  NewsSources.scrape_content source_url
		if doc.present?
			output = doc.css(css_string)
		end
		output
	end

	def self.scrape_content url
		begin
			doc = Nokogiri::HTML(open(url))
		rescue Exception => e
			puts e.to_s
		end
		doc
	end


	def self.filter_news_on_date news_data, params
		if params[:date].is_a? Array
			output = NewsSources.filter_news_on_date_range news_data,params
		else
			output = []
			news_data.each do |news|
				if TimeHelper.same(params[:date],params[:class].get_date(news))
					output << news
				end
			end
		end
		output
	end

	def self.filter_news_on_date_range news_data, params
		output = []
		news_data.each do |news|
			if TimeHelper.is_in_between(params[:date][0],params[:class].get_date(news),params[:date][1])
				output << news
			end
		end
		output
	end

	def self.get_complete_news_link relative_news_url, source_url
		output = relative_news_url
		if relative_news_url[0] == '/'
			source = source_url.split(/(?<!\/)\/(?!\/)/)[0]
			output = source + relative_news_url
		end
		output
	end

	def self.get_news_info_css
		puts "No CSS for abstract class NewsSources".red
	end

	def self.get_source
		puts " No Source URL for abstract class NewsSources".red
	end

	def self.get_metadata news_info
		puts " No metadata generator for abstract class NewsSources".red
	end

	def self.filter_news news_data
		puts " No specific filter for abstract class NewsSources".red
	end

end