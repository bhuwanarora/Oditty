class Book::GoogleBooks < Book
	def self.get query
		books_title = []
		begin
			query = query.gsub(" ","+")
			url = "https://www.googleapis.com/books/v1/volumes?q=#{query}&maxResults=40&projection=lite&printType=books"
			books_info = (JSON.parse(Net::HTTP.get(URI.parse(URI.encode(url)))))["items"]
			books_info.each { |book_info| books_title << book_info["volumeInfo"]["title"] }
		rescue Exception => e
			puts e.to_s.red
		end
		puts books_title.to_s.green
		books_title.uniq.compact
	end
end