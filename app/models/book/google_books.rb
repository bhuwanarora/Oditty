class Book::GoogleBooks < Book
	def self.get query, keys_tried = 0
		@@keys_index ||= 0
		if keys_tried > 0
			@@keys_index = (@@keys_index + 1)% Constant::Count::GoogleKeysCount
		end
		books_title = []
		books_author = []
		output = nil
		begin
			query = query.gsub(" ","+")
			url = "https://www.googleapis.com/books/v1/volumes?q=#{query}&maxResults=40&projection=lite&printType=books&key="+Rails.application.config.google_public_key[@@keys_index]
			url_encoded = URI.parse(URI.encode(url))
			response = Net::HTTP.get(url_encoded)
			puts response.to_s.yellow
			books_info = JSON.parse(response)["items"]
			books_info.each do |book_info|
				books_title << book_info["volumeInfo"]["title"]
				books_author << book_info["volumeInfo"]["authors"]
			end
			puts books_title.to_s.green
			puts books_author.to_s.green
			output = books_title.zip(books_author)
		rescue Exception => e
			puts ("GoogleSearchError: " + e.to_s).red
			puts "Switching to next Google key ".green
			if keys_tried < Constant::Count::GoogleKeysCount
				output = Book::GoogleBooks.get(query, keys_tried + 1)
			end
		end
		output
	end
end