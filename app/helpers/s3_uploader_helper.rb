module S3UploaderHelper
	# require 'rubygems'
	# require 'aws-sdk'
	# require 'open-uri'
	
	def self.upload_file(input_file, output_key)
		@s3 ||= AWS::S3.new
		# output_key = File.basename(input_file)
		@s3.buckets['rd-images'].objects[output_key].write(:file => input_file)
	end

	def self.delete_file(bucket_name, key)
		@s3 ||= AWS::S3.new
		bucket = @s3.bucket('rd-images')
		if bucket.objects[key].exists?
			bucket.delete_key(key)
		end
	end

	def self.upload_cover_photos
		@neo = Neography::Rest.new
		clause = "MATCH (c:CoverPhoto) WHERE c.status=true RETURN c.url, ID(c)"
		urls = @neo.execute_query(clause)["data"]
		for url in urls
			self.upload_cover_photo url
		end
	end

	def self.upload_cover_photo data
		name = data[1].to_s+".jpg"
		key = "cp/"+name
		puts "#{name}".green
		open(name, 'wb') do |file|
			file << open(data[0]).read
		end
		self.upload_file(name, key)
		File::delete(name)
	end

	def self.upload_author_images
		@s3 = AWS::S3.new
		@neo = Neography::Rest.new
		skip = 1000
		start_id = 1059390 #MIN ID
		end_id = 2655788 #MAX ID
		while start_id <= end_id
			puts "upload_author_images..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (a:Author) WHERE ID(a) > "+start_id.to_s+" AND ID(a) < "+limit.to_s+" AND a.image_url IS NOT NULL AND a.image_url <> \"\" RETURN COLLECT(a.image_url), COLLECT(ID(a))"
			data = @neo.execute_query(clause)["data"][0]
			image_urls = data[0]
			ids = data[1]
			ids.each_with_index do |id, index|
				begin
					puts id.to_s.green
					url = image_urls[index]
					url = url.gsub("http:http", "http")
					if id == 385526
						url = "http://m.c.lnkd.licdn.com/mpr/pub/image-LLrYD_OR6VUsqtXEJ1KmnXPy1zFtUth6LLkg8t_f1FLg2PVXLLrgU47R1Yz2n_vH6Ee8/nancy-ohlin.jpg"
					elsif id == 386942
						url ="http://m.c.lnkd.licdn.com/mpr/pub/image-24YYLlk7VOVyx4vHbB2m_YZnMmAuogEVUqYgfSnSM2GfoWjj24YgfwS7MnuZogh7RUrJ/lisa-marie-klein.jpg"
					elsif id == 388800
						url = "http://www.csu.edu.au/__data/assets/image/0005/585374/M-Daniel.jpg"
					elsif id == 391746
						url = "http://m.c.lnkd.licdn.com/mpr/pub/image-pgbUP81FFrcM1GmgfbslxdiqAqMf5ILC0gsAxkjDAhLZV5QmpgbAi0nFAT8BV7o4-1RT/tiffany-king.jpg"
					end

					name = id.to_s+"-O.png"
					key = id.to_s+"/O.png"
					puts url.red
					if url.present?
						open(name, 'wb') do |file|
							file << open(url).read
						end
						@s3.buckets['rd-authors'].objects[key].write(:file => name)
						File::delete(name)
					end
				rescue Exception => e
					puts e.to_s.red
				end
			end
			start_id = start_id + skip
		end
	end

	def self.get_images2
		@neo = Neography::Rest.new
		skip = 1000
		start_id = 1419752 #MIN ID 
		end_id = 2655796 #MAX ID
		while start_id <= end_id
			puts "get_images2..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (b:Book) WHERE ID(b) > "+start_id.to_s+" AND ID(b) < "+limit.to_s+" RETURN b.isbn"
			isbns = @neo.execute_query(clause)["data"]
			for isbn in isbns
				puts isbn.to_s.green
				if isbn[0].present?
					isbn_array = isbn[0].split(",")
					for each_isbn in isbn_array
						begin
							self.upload_image(each_isbn, name)
						rescue Exception => e
							begin
								self.upload_image(each_isbn, name)
							rescue Exception => e
								begin
								self.upload_image(each_isbn, name)
								rescue Exception => e
									begin
										self.upload_image(each_isbn, name)
									rescue Exception => e
										puts e.to_s.red	
									end	
								end	
							end
						end

					end
				end
			end

			start_id = start_id + skip
		end
	end

	def self.get_images
		@neo = Neography::Rest.new
		skip = 1000
		start_id = 418934 #MIN ID
		end_id = 2655796 #MAX ID
		while start_id <= end_id
			puts "get_images..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (b:Book) WHERE ID(b) > "+start_id.to_s+" AND ID(b) < "+limit.to_s+" RETURN b.isbn"
			isbns = @neo.execute_query(clause)["data"]
			for isbn in isbns
				puts isbn.to_s.green
				if isbn[0].present?
					isbn_array = isbn[0].split(",")
					for each_isbn in isbn_array
						begin
							self.upload_image(each_isbn, name)
						rescue Exception => e
							begin
								self.upload_image(each_isbn, name)
							rescue Exception => e
								begin
								self.upload_image(each_isbn, name)
								rescue Exception => e
									begin
										self.upload_image(each_isbn, name)
									rescue Exception => e
										puts e.to_s.red	
									end	
								end	
							end
						end
					end
				end
			end

			start_id = start_id + skip
		end
	end

	private
	def self.upload_image(each_isbn, name)
		key = each_isbn.to_s+"/L.jpg"
		name = each_isbn.to_s+"-L.jpg"
		url = "http://covers.openlibrary.org/b/isbn/"+name
		open(name, 'wb') do |file|
			file << open(url).read
		end
		self.upload_file(name, key)
		File::delete(name)

		key = each_isbn.to_s+"/M.jpg"
		name = each_isbn.to_s+"-M.jpg"
		url = "http://covers.openlibrary.org/b/isbn/"+name
		open(name, 'wb') do |file|
			file << open(url).read
		end
		self.upload_file(name, key)
		File::delete(name)

		key = each_isbn.to_s+"/S.jpg"
		name = each_isbn.to_s+"-S.jpg"
		url = "http://covers.openlibrary.org/b/isbn/"+name
		open(name, 'wb') do |file|
			file << open(url).read
		end
		self.upload_file(name, key)
		File::delete(name)
	end

end