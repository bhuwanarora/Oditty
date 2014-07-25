module WikiCrawler
	include ELogger
	require 'nokogiri'
	require 'open-uri'

	def self.get_author_links
		Author.where(:wiki_url => nil).find_each do |author|
			begin
				author_name = author.human_profile.name rescue nil
				next if author_name.blank?
				author_search =  I18n.transliterate(author_name.gsub(" ","+").downcase)
				url = "https://www.google.co.in/search?q=#{author_search}"
				doc = Nokogiri::HTML(open(url))

				index = 1
				author_link = "http://google.co.in"+doc.css(".g:nth-child(#{index}) .r a")[0].attr("href")
				is_a_wiki_link = author_link.include? "wiki"
				while !is_a_wiki_link
					index = index + 1
					link = doc.css(".g:nth-child(#{index}) .r a")[0]
					if link
						author_link = "http://google.co.in"+link.attr("href")
						is_a_wiki_link = author_link.include? "wiki"
					else
						break
					end
				end
				author.update_column(:wiki_url, author_link)
				puts "#{author_name}".green
			rescue => e
				# author.update_column(:comments, e)
				puts "#{author.id} #{author_name} #{e}".red
			end
		end
	end


	def get_author_details
		Author.where("wiki_url != ?", "").find_each do |author|
			begin
				wiki_url = author.wiki_url
				doc = Nokogiri::HTML(open(wiki_url))
				thumb_url = "http:"+doc.css('.vcard img')[0].attr("src") rescue ""
				if thumb_url.include? "jpg"
					image_url = thumb_url.gsub("thumb/", "").split("jpg")[0]+"jpg"
				elsif thumb_url.include? "JPG"
					image_url = thumb_url.gsub("thumb/", "").split("JPG")[0]+"JPG"
				end
				signature_pic = "http:"+doc.css('th+ td img')[0].attr("src") rescue ""
 				about = doc.css('.vcard+ p')[0].content
 												.gsub("[1]", "")
 												.gsub("[2]", "")
 												.gsub("[3]", "")
 												.gsub("[4]", "")
 												.gsub("[5]", "")
 												.gsub("[6]", "")
 												.gsub("[7]", "")
 												.gsub("[8]", "")
 												.gsub("[9]", "")
 												.gsub("[10]", "")
 												.gsub("[11]", "")
 												.gsub("[12]", "")
 												.gsub("[13]", "")
 												.gsub("[14]", "")
 												.gsub("[15]", "")
 												.gsub("[16]", "")
 												.gsub("[17]", "")
 												.gsub("[18]", "")
 												.gsub("[19]", "")
 												.gsub("[20]", "")
 												.gsub("[a]", "")
 												.gsub("[b]", "")
 												.gsub("[c]", "")
 												.gsub("[d]", "")
 												.gsub("[e]", "")
 												.gsub("[f]", "") rescue nil
 				details = doc.css(".vcard")[0].content rescue ""
 				debugger
			rescue Exception => e
				debugger
				puts e
			end
			details
		end
	end
end