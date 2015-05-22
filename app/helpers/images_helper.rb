module ImagesHelper
	def self.init_base_url
		@base_url = "https://s3-ap-southeast-1.amazonaws.com/rd-genres/"
	end

	def self.set_genre_images
		images = [
			{:key => "art.jpg", :name => "Arts & Photography"},
			{:key => "biographies.jpg", :name => "Biographies & Memoirs"},
			{:key => "business.jpg", :name => "Business & Investing"},
			{:key => "children.jpg", :name => "Children's Books"},
			{:key => "comics.jpg", :name => "Comics & Graphic Novels"},
			{:key => "computers.jpg", :name => "Computers & Internet"},
			{:key => "cooking.jpg", :name => "Cooking, Food & Wine"},
			{:key => "entertainment.jpg", :name => "Entertainment"},
			{:key => "gay_and_lesbian.jpg", :name => "Gay & Lesbian"},
			{:key => "health.jpg", :name => "Health, Mind & Body"},
			{:key => "history.jpg", :name => "History"},
			{:key => "home.jpg", :name => "Home & Garden"},
			{:key => "law.jpg", :name => "Law"},
			{:key => "literature.jpg", :name => "Literature & Fiction"},
			{:key => "medicine.jpg", :name => "Medicine"},
			{:key => "mystery.jpg", :name => "Mystery & Thrillers"},
			{:key => "nature.jpg", :name => "Outdoors & Nature"},
			{:key => "non_fiction.jpg", :name => "Nonfiction"},
			{:key => "parenting.jpg", :name => "Parenting & Families"},
			{:key => "reference.jpg", :name => "Reference"},
			{:key => "religion.jpg", :name => "Religion & Spirituality"},
			{:key => "romance.jpg", :name => "Romance"},
			{:key => "science.jpg", :name => "Science"},
			{:key => "science_fiction.jpg", :name => "Science Fiction & Fantasy"},
			{:key => "sports.jpg", :name => "Sports"},
			{:key => "technical.jpg", :name => "Professional & Technical"},
			{:key => "teens.jpg", :name => "Teens"},
			{:key => "travel.jpg", :name => "Travel"}
		]

		@neo = Neography::Rest.new
		for image in images
			clause = "MATCH (c:Category) WHERE c.is_root = true AND c.name =\""+image[:name]+"\" SET c.aws_key ='"+image[:key]+"'"
			puts clause.blue.on_red
			@neo.execute_query clause
		end
	end

	def self.set_user_image_version
		get_ids_range_clause = " MATCH (node:User) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		ids_range = get_ids_range_clause.execute[0]
		minimum = File.exist?("user_ids.json") ? JSON.parse(File.read("user_ids.json"))["minimum"] : ids_range["minimum"]
		maximum = ids_range["maximum"]
		range = (maximum - minimum) / 500
		while minimum < maximum
			clause = "MATCH (user:User) WHERE ID(user) <= #{minimum + range} AND ID(user) >= #{minimum} RETURN user.thumb AS image_url, ID(user) AS id " 	
			users = clause.execute
			users.each do |user|
				begin
					ids_range = {}
					ids_range[:minimum] = user["id"]
					ids_range[:maximum] = maximum
					url = "#{Rails.application.config.image_service}/api/v0/user_versions?id=#{user["id"]}&&bucket=#{Rails.application.config.user_bucket}&&url=#{user["image_url"]}"
					puts url.to_s.red
					response = JSON.parse(Net::HTTP.get(URI.parse(URI.encode(url))))
					File.open("user_ids.json", 'w') {|file| file.write(ids_range.to_json)}
				rescue Exception => e
					puts e.to_s.red
					message = "#{e} for id #{user["id"]} at #{ Time.now.strftime("%D")}"
					File.open("log/uploader.log", 'a') { |file| file.puts(message) }
				end
			end
			minimum += range
		end
	end

	def self.set_community_image_version
		get_ids_range_clause = " MATCH (node:Community) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		ids_range = get_ids_range_clause.execute[0]
		minimum = File.exist?("community_ids.json") ? JSON.parse(File.read("community_ids.json"))["minimum"] : ids_range["minimum"]
		maximum = ids_range["maximum"]
		range = (maximum - minimum) / 500
		while minimum < maximum
			clause = "MATCH (community:Community) WHERE ID(community) <= #{minimum + range} AND ID(community) >= #{minimum} " + Community.return_init + Community.basic_info	
			communitites = clause.execute
			communitites.each do |community|
				begin
					ids_range = {}
					ids_range[:minimum] = community["id"]
					ids_range[:maximum] = maximum
					url = "#{Rails.application.config.image_service}/api/v0/community_versions?id=#{community["id"]}&&bucket=#{Rails.application.config.community_bucket}&&url=#{community["image_url"]}"
					puts url.to_s.red
					response = JSON.parse(Net::HTTP.get(URI.parse(URI.encode(url))))
					File.open("community_ids.json", 'w') {|file| file.write(ids_range.to_json)}
				rescue Exception => e
					puts e.to_s.red
					message = "#{e} for id #{community["id"]} at #{ Time.now.strftime("%D")}"
					File.open("log/uploader.log", 'a') { |file| file.puts(message) }
				end
			end
			minimum += range
		end
	end

	def self.set_news_image_version
		get_ids_range_clause = " MATCH (node:News) RETURN MAX(ID(node)) AS maximum , MIN(ID(node)) AS minimum "
		ids_range = get_ids_range_clause.execute[0]
		minimum = File.exist?("news_ids.json") ? JSON.parse(File.read("news_ids.json"))["minimum"] : ids_range["minimum"]
		maximum = ids_range["maximum"]
		range = (maximum - minimum) / 500
		while minimum < maximum
			clause = "MATCH (news:News) WHERE ID(news) <= #{minimum + range} AND ID(news) >= #{minimum} " + News.return_init + News.basic_info	
			newss = clause.execute
			newss.each do |news|
				puts news["id"].to_s.green
				begin
					ids_range = {}
					ids_range[:minimum] = news["id"]
					ids_range[:maximum] = maximum
					File.open("news_ids.json", 'w') {|file| file.write(ids_range.to_json)}
					url = "#{Rails.application.config.image_service}/api/v0/news_versions?id=#{news["id"]}&&bucket=#{Rails.application.config.news_bucket}&&url=#{news["image_url"]}"
					puts url.to_s.red
					response = JSON.parse(Net::HTTP.get(URI.parse(URI.encode(url))))
				rescue Exception => e
					puts e.to_s.red
					message = "#{e} for id #{news["id"]} at #{ Time.now.strftime("%D")}"
					File.open("log/uploader.log", 'a') { |file| file.puts(message) }
				end
			end
			minimum += range
		end
	end
end