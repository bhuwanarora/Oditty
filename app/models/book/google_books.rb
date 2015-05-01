class Book::GoogleBooks < Book
	def self.get query
		books_title = []
		begin
			query = query.gsub(" ","+")
			url = "https://www.googleapis.com/books/v1/volumes?q=#{query}&maxResults=40&projection=lite&printType=books"
			url_encoded = URI.parse(URI.encode(url))
			response = Net::HTTP.get(url_encoded)
			books_info = JSON.parse(response)["items"]
			# File.open("log/google_book_api.log", 'a') { |file| file.write("#{JSON.parse(response).to_s} at #{Time.now} while processing #{query}")}
			books_info.each { |book_info| books_title << book_info["volumeInfo"]["title"] }
		rescue Exception => e
			puts e.to_s.red
			# File.open("log/google_book_api.log", 'a') { |file| file.write("#{e} at #{Time.now} while processing #{query}")}
		end
		# File.close
		puts books_title.to_s.green
		books_title.uniq.compact
	end
end