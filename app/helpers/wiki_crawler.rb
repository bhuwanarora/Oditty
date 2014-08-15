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

	def self.get_book_links
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


	def self.get_author_details
		@neo = Neography::Rest.new
		Author.where("wiki_url != ?", "").find_each do |author|
			begin
				headings_init = false
				set_clause = ""
				wiki_url = author.wiki_url
				# wiki_url = "http://en.wikipedia.org/wiki/Anne_Frank"
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
 												.gsub("[21]", "")
 												.gsub("[22]", "")
 												.gsub("[23]", "")
 												.gsub("[24]", "")
 												.gsub("[25]", "")
 												.gsub("[26]", "")
 												.gsub("[27]", "")
 												.gsub("[28]", "")
 												.gsub("[29]", "")
 												.gsub("[30]", "")
 												.gsub("[31]", "")
 												.gsub("[32]", "")
 												.gsub("[33]", "")
 												.gsub("[34]", "")
 												.gsub("[35]", "")
 												.gsub("[36]", "")
 												.gsub("[37]", "")
 												.gsub("[38]", "")
 												.gsub("[39]", "")
 												.gsub("[40]", "")
 												.gsub("[41]", "")
 												.gsub("[42]", "")
 												.gsub("[43]", "")
 												.gsub("[44]", "")
 												.gsub("[a]", "")
 												.gsub("[b]", "")
 												.gsub("[c]", "")
 												.gsub("[d]", "")
 												.gsub("[e]", "")
 												.gsub("[f]", "")
 												.gsub("[g]", "")
 												.gsub("[h]", "")
 												.gsub("[i]", "")
 												.gsub("[j]", "")
 												.gsub("[k]", "")
 												.gsub("[l]", "")
 												.gsub("[m]", "")
 												.gsub("[n]", "")
 												.gsub("[o]", "")
 												.gsub("[p]", "")
 												.gsub("\"", "'") rescue ""
 				details = doc.css(".vcard")[0].content rescue ""
 				official_website = doc.css('.vcard .text')[0].attr('href').gsub("\"", "'") rescue ""
 				head = ""
 				desc = ""
 				index = 1
 				details.split("\n").each do |detail|
 					if detail.present?
 						if head.present?
 							headings_init = true
 							if desc.present?
 								desc = desc + ", " + detail
 							else
 								desc = detail
 							end
 						else
 							head = detail
 						end
 					else
 						if head.present? && desc.present?
 							# puts head+"-"+desc.to_s.blue
 							head = I18n.transliterate(head).downcase.gsub(" ","_").gsub("?","_").gsub("'", "").gsub("(", "").gsub(")", "")
 							init_set_clause = " author."+head+"=\""+desc.gsub("\"", "'")+"\""
 							if set_clause.present?
 								set_clause = set_clause + "," + init_set_clause
 							else
 								set_clause = init_set_clause
 							end
	 						head = ""
	 						desc = ""
	 					else
	 						unless headings_init
	 							head = ""
	 							desc = ""
	 						end
 						end
 					end
 				end
 				author_name = "@"+author.human_profile.name.downcase.gsub(" ","").gsub("'", "")
 				clause = "START author=node:node_auto_index('indexed_main_author_name:"+author_name+"') SET"+set_clause+", author.about=\""+about+"\", author.image_url=\""+image_url.to_s+"\", author.signature_pic=\""+signature_pic.to_s+"\", author.official_website=\""+official_website.to_s+"\""
 				puts clause.blue.on_red
 				@neo.execute_query(clause)["data"]
 				# puts about.to_s.strip.green
 				# puts signature_pic.to_s.strip.green
 				# puts official_website.to_s.strip.green
 				# puts image_url.to_s.strip.green
 				puts "----------------".green
 				author.update_column('flag', true)
			rescue Exception => e
				author.update_column('flag', false)
				puts e.to_s.red
			end
		end
	end
end