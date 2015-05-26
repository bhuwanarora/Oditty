class Book::GoogleBooks < Book
	def self.get query
		books_title = []
		books_author = []
		begin
			query = query.gsub(" ","+")
			url = "https://www.googleapis.com/books/v1/volumes?q=#{query}&maxResults=40&projection=lite&printType=books&key="+Rails.application.config.google_public_key
			url_encoded = URI.parse(URI.encode(url))
			response = Net::HTTP.get(url_encoded)
			puts response.to_s.yellow			
			books_info = JSON.parse(response)["items"]						
			# File.open("log/google_book_api.log", 'a') { |file| file.write("#{JSON.parse(response).to_s} at #{Time.now} while processing #{query}")}
			books_info.each do |book_info|
				books_title << book_info["volumeInfo"]["title"]
				books_author << book_info["volumeInfo"]["authors"]				
			end			
		rescue Exception => e
			puts e.to_s.red
			# File.open("log/google_book_api.log", 'a') { |file| file.write("#{e} at #{Time.now} while processing #{query}")}
		end
		# File.close				
		puts books_title.to_s.green
		puts books_author.to_s.green
		books_title.zip(books_author)
		
	end
end