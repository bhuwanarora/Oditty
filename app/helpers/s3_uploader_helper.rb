module S3UploaderHelper
	# require 'rubygems'
	# require 'aws-sdk'
	# require 'open-uri'
	
	def self.upload_file(file_name, key)
		s3 = AWS::S3.new

		# Upload a file.
		# key = File.basename(file_name)
		s3.buckets['rd-images'].objects[key].write(:file => file_name)
	end

	def self.get_images2
		@neo = Neography::Rest.new
		skip = 1000
		start_id = 1384293 #MIN ID
		end_id = 2655796 #MAX ID
		while start_id <= end_id
			puts "remove_attherate..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (b:Book) WHERE ID(b) > "+start_id.to_s+" AND ID(b) < "+limit.to_s+" RETURN b.isbn"
			isbns = @neo.execute_query(clause)["data"]
			for isbn in isbns
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
		start_id = 384293 #MIN ID
		end_id = 2655796 #MAX ID
		while start_id <= end_id
			puts "remove_attherate..."+start_id.to_s.green
			limit = start_id + skip
			clause = "MATCH (b:Book) WHERE ID(b) > "+start_id.to_s+" AND ID(b) < "+limit.to_s+" RETURN b.isbn"
			isbns = @neo.execute_query(clause)["data"]
			for isbn in isbns
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