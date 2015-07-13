module GoogleSearchHelper
	
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
		self.init
		page = @@agent.get('http://www.google.com/')
		google_form = page.form('f')
		google_form.q = query
		page = @@agent.submit(google_form, google_form.buttons.first)
		self.handle_output page
	end

end