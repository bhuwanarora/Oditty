module S3UploaderHelper
	# require 'rubygems'
	# require 'aws-sdk'
	# require 'open-uri'
	
	def self.upload_file(file_name, key)
		@s3 ||= AWS::S3.new
		# Upload a file.
		# key = File.basename(file_name)
		@s3.buckets['rd-images'].objects[key].write(:file => file_name)
	end

	def self.upload_author_images
		@s3 = AWS::S3.new
		@neo = Neography::Rest.new
		skip = 1000
		start_id = 387125 #MIN ID
		end_id = 2655788 #MAX ID
		while start_id <= end_id
			puts "upload_author_images..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (a:Author) WHERE ID(a) > "+start_id.to_s+" AND ID(a) < "+limit.to_s+" AND a.image_url IS NOT NULL AND a.image_url != \"\" RETURN COLLECT(a.image_url), COLLECT(ID(a))"
			data = @neo.execute_query(clause)["data"][0]
			image_urls = data[0]
			ids = data[1]
			ids.each_with_index do |id, index|
				puts id.to_s.green
				url = image_urls[index]
				if id == 385526
					url = "http://m.c.lnkd.licdn.com/mpr/pub/image-LLrYD_OR6VUsqtXEJ1KmnXPy1zFtUth6LLkg8t_f1FLg2PVXLLrgU47R1Yz2n_vH6Ee8/nancy-ohlin.jpg"
				elsif id == 386942
					url ="http://m.c.lnkd.licdn.com/mpr/pub/image-24YYLlk7VOVyx4vHbB2m_YZnMmAuogEVUqYgfSnSM2GfoWjj24YgfwS7MnuZogh7RUrJ/lisa-marie-klein.jpg"
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
			end
			start_id = start_id + skip
		end
	end

	def self.get_images2
		@neo = Neography::Rest.new
		skip = 1000
		start_id = 1385169 #MIN ID 
		end_id = 2655796 #MAX ID
		while start_id <= end_id
			puts "remove_attherate..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (b:Book) WHERE ID(b) > "+start_id.to_s+" AND ID(b) < "+limit.to_s+" RETURN b.isbn"
			isbns = @neo.execute_query(clause)["data"]
			for isbn in isbns
				puts isbn.to_s.green
				if isbn[0].present?
					isbn_array = isbn[0].split(",")
					for each_isbn in isbn_array
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
			end

			start_id = start_id + skip
		end
	end

	def self.get_images
		@neo = Neography::Rest.new
		skip = 1000
		start_id = 386401 #MIN ID
		end_id = 2655796 #MAX ID
		while start_id <= end_id
			puts "remove_attherate..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (b:Book) WHERE ID(b) > "+start_id.to_s+" AND ID(b) < "+limit.to_s+" RETURN b.isbn"
			isbns = @neo.execute_query(clause)["data"]
			for isbn in isbns
				puts isbn.to_s.green
				if isbn[0].present?
					isbn_array = isbn[0].split(",")
					for each_isbn in isbn_array
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
			end

			start_id = start_id + skip
		end
	end

end