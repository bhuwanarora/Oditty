module GoogleSearchHelper
	SearchTypes = {:web => "Web", :video => "Video", :image => "Image"}
	VideoCount 	= 10
	NewsCount 	= 10
	def self.init
		@@agent ||= Mechanize.new
	end

	def self.handle_output google_scrape_output
		output = []
		google_scrape_output.links.each do |link|
			if link.href.to_s =~/url.q/
		        str=link.href.to_s
		        strList=str.split(%r{=|&}) 
		        url=strList[1] 
		        output << url
	    	end 
	    end
	    output
	end

	def self.search query
		GoogleSearchHelper.init
		page = @@agent.get('http://www.google.com/')
		google_form = page.form('f')
		google_form.q = query
		page = @@agent.submit(google_form, google_form.buttons.first)
		GoogleSearchHelper.handle_output page
	end

	#Using google-search-api
	def self.get_web_urls query
		search_output = GoogleSearchHelper.search(query, SearchTypes[:web])
		output = GoogleSearchHelper.handle_web(search_output)
	end

	def self.search query, type
		search_class = ('Google::Search::' + type).split('::').inject(Object) {|o,c| o.const_get c}
		output = search_class.new do |search|
			search.query = query
			search.size = :small
		end
		output
	end

	def self.handle_search_output search_output, type
		output = []
		if type == SearchTypes[:web]
			output = GoogleSearchHelper.handle_web search_output
		elsif type == SearchTypes[:video]
			output = GoogleSearchHelper.handle_video search_output
		end
		output
	end

	def self.handle_video search_output
		search_output.first(VideoCount).each_with_index.map{|item, google_rank| {
				:url   		=> item.uri,
				:title 		=> item.content.gsub("\\", "\\\\\\").gsub("\"", "\\\\\""),
				:thumbnail	=> item.thumbnail_uri,
				:duration	=> item.duration,
				:publisher	=> item.publisher,
				:published_date => item.published.to_time.to_i,
				:rank 		=> google_rank
			}}
	end

	def self.handle_web search_output
		url_list = search_output.first(NewsCount).map{|item| item.uri}
		output = GoogleSearchHelper.get_url_specification url_list
	end

	def self.get_url_specification url_list, valid_index = 9
		output = {:url => url_list, :fb_url => "", :twitter_url => "", :wiki_url => "", :wiki_title => "" }
		url_list.each_with_index do |url, index|
			if index > valid_index
				break
			end
			if url =~ /facebook.com/ && output[:fb_url].empty?
				output[:fb_url] = url
			elsif url =~ /twitter.com/ && output[:twitter_url].empty?
				output[:twitter_url] = url
			elsif url =~ /wikipedia.org/
				output[:wiki_url] = url
				if url =~ /\/wiki\//
					output[:wiki_title] = url.sub(/.*?\/wiki\//, '')
				elsif url =~ /\/\?title=/
					output[:wiki_title] = url.sub(/.*?\/\?title=/, '')
				end
			end
		end
		output
	end

	def self.search_multiple_types query, types
		threads = []
		output = {}
		types.each do |type|
			threads << Thread.new(){
				output[type] = GoogleSearchHelper.handle_search_output(self.search(query,type),type)
			}
		end
		threads.each {|thread| thread.join}
		output
	end

	def self.fetch_wiki_info community_name
		web_search = (GoogleSearchHelper.search_multiple_types community_name, [SearchTypes[:web]])[SearchTypes[:web]]
		web_search[:url_list] = web_search[:url]
		web_search[:url] = web_search[:wiki_url]
		web_search[:title] = web_search[:wiki_title]
		web_search
	end

end