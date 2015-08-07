module NewsHelper

	def self.handle
		news_sources ||= NewsHelper.fetch_news_sources
		puts news_sources
		for news_source in news_sources
			
			news_links = NewsHelper.fetch_news news_source["url"]
			puts news_links
			for news_link in news_links
				news_metadata = {}
				puts news_link
				news_metadata = News.get_metadata news_link
				news_metadata["news_link"] = news_link
				news_metadata["region"] = news_source["region"]
				CommunitiesHelper.create news_metadata
			end
		end
	end

	def self.fetch_news_sources
		news_sources = []
		google_news_edition_url = Rails.application.config.google_news_sources
		doc = Nokogiri::HTML(open(google_news_edition_url)).css('.i a')
		for news_source in doc
			if (news_source.children.text =~ /^[a-zA-Z]+$/) == 0 and !news_source.nil?
				news_sources << {"url" => news_source["href"], "region" => news_source.children.text}
			end
		end
		news_sources
	end

	def self.fetch_news news_source
		news_links = []
		doc = Nokogiri::HTML(open(URI(news_source))).css('.esc .esc-lead-article-title a')
		for news_link in doc
			news_links << news_link["href"]
		end
		news_links
	end

	def self.fetch_tags news_link
		query = Rails.application.config.nlp_service + "api/v0/parser?q=" + URI.encode(news_link,/\W/)
		puts query
		uri = URI(query)
		response = Net::HTTP.get(uri)
	end

	def self.map_topics news_id, topics
		topics.each do |topic|
			clause = News.new(news_id).match + " MERGE (topic:Topic{name:'" + topic["value"].to_s + "'}) <-[:HasTopic {relevance :"+ topic["relevance"].to_s+" }]-(news) "
			clause.execute
		end
	end

	def self.delete_communit_links news_id
		clause = News.new(news_id).match + News.match_community + " DELETE has_community "\
		" RETURN news.url AS url"
		url = clause.execute[0]["url"]
	end

	def self.handle_wrong_community_linkage news_id
		begin
			news_link = NewsHelper.delete_communit_links news_id
			news_metadata = {"available" => true, "news_link" => news_link}
			CommunitiesHelper.create news_metadata
		rescue Exception => e
			puts e.to_s.red
		end
	end

	def self.handle_wrong_communities_linkage
		clause = " MATCH (news:News) "\
				" WHERE news.url =~'.*&.*'"\
				" RETURN ID(news) AS id"
		id_list = clause.execute.map{|elem| elem["id"]}
		id_list.each do |news_id|
			NewsHelper.handle_wrong_community_linkage news_id
		end
	end

	def self.send_newsletter
		info = News.get_popular_news_from_last_week.execute
		params = {
					:news1 => {:community1 => {}, :community2 => {}}, 
				  	:news2 => {:community1 => {}, :community2 => {}}, 
				  	:news3 => {:community1 => {}, :community2 => {}}, 
				  	:news4 => {:community1 => {}, :community2 => {}}
				}
		params[:news1][:title] = info[0]["title"] rescue ""
		params[:news2][:title] = info[1]["title"] rescue ""
		params[:news3][:title] = info[2]["title"] rescue ""
		params[:news4][:title] = info[3]["title"] rescue ""
		params[:news1][:description] = info[0]["description"] rescue ""
		params[:news2][:description] = info[1]["description"] rescue ""
		params[:news3][:description] = info[2]["description"] rescue ""
		params[:news4][:description] = info[3]["description"] rescue ""
		params[:news1][:url] = info[0]["url"] rescue ""
		params[:news2][:url] = info[1]["url"] rescue ""
		params[:news3][:url] = info[2]["url"] rescue ""
		params[:news4][:url] = info[3]["url"] rescue ""
		params[:news1][:image_url] = info[0]["image_url"] rescue ""
		params[:news2][:image_url] = info[1]["image_url"] rescue ""
		params[:news3][:image_url] = info[2]["image_url"] rescue ""
		params[:news4][:image_url] = info[3]["image_url"] rescue ""
		params[:news1][:id] = info[0]["id"] rescue ""
		params[:news2][:id] = info[1]["id"] rescue ""
		params[:news3][:id] = info[2]["id"] rescue ""
		params[:news4][:id] = info[3]["id"] rescue ""
		params[:news1][:community1][:id] = info[0]["communities"][0]["id"] rescue ""
		params[:news1][:community2][:id] = info[0]["communities"][1]["id"] rescue ""
		params[:news2][:community1][:id] = info[1]["communities"][0]["id"] rescue ""
		params[:news2][:community2][:id] = info[1]["communities"][1]["id"] rescue ""
		params[:news3][:community1][:id] = info[2]["communities"][0]["id"] rescue ""
		params[:news3][:community2][:id] = info[2]["communities"][1]["id"] rescue ""
		params[:news4][:community1][:id] = info[3]["communities"][0]["id"] rescue ""
		params[:news4][:community2][:id] = info[3]["communities"][1]["id"] rescue ""
		params[:news1][:community1][:name] = info[0]["communities"][0]["name"] rescue ""
		params[:news1][:community2][:name] = info[0]["communities"][1]["name"] rescue ""
		params[:news2][:community1][:name] = info[1]["communities"][0]["name"] rescue ""
		params[:news2][:community2][:name] = info[1]["communities"][1]["name"] rescue ""
		params[:news3][:community1][:name] = info[2]["communities"][0]["name"] rescue ""
		params[:news3][:community2][:name] = info[2]["communities"][1]["name"] rescue ""
		params[:news4][:community1][:name] = info[3]["communities"][0]["name"] rescue ""
		params[:news4][:community2][:name] = info[3]["communities"][1]["name"] rescue ""
		params[:news1][:community1][:image_url] = info[0]["communities"][0]["image_url"] rescue ""
		params[:news1][:community2][:image_url] = info[0]["communities"][1]["image_url"]  rescue ""
		params[:news2][:community1][:image_url] = info[1]["communities"][0]["image_url"] rescue ""
		params[:news2][:community2][:image_url] = info[1]["communities"][1]["image_url"]  rescue ""
		params[:news3][:community1][:image_url] = info[2]["communities"][0]["image_url"]  rescue ""
		params[:news3][:community2][:image_url] = info[2]["communities"][1]["image_url"]  rescue ""
		params[:news4][:community1][:image_url] = info[3]["communities"][0]["image_url"]  rescue ""
		params[:news4][:community2][:image_url] = info[3]["communities"][1]["image_url"]  rescue ""
		params[:template] = Constant::EmailTemplate::Newsletter
		SubscriptionMailer.news_subscription(params).deliver
	end

	def self.insert_news
		NewsSources.init_news_queue
		producer_thread  = Thread.new{ NewsSources.producer_thread }
		consumer_thread  = Thread.new{ NewsSources.consumer_thread }
		consumer_thread.join
	end

	def self.insert_old_lit_news
		NewsSources.init_news_queue
		producer_thread  = Thread.new{ NewsSources.producer_thread_old_news_no_google }
		consumer_thread  = Thread.new{ NewsSources.consumer_thread }
		consumer_thread.join
	end


end