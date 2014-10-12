module FacebookConnectHelper
	def self.add_books_read params, user_id
		begin
			if params[:data].class == Array
				params[:data].each do |book_data|
					book = book_data["data"]["book"]
					indexed_title = book["title"].gsub(" ", "").downcase
					url_splitter = book["url"].split("/")
					url_id = url_splitter[url_splitter.length - 1]
					progress = book_data["data"]["progress"]
					activity_id = book_data["data"]["id"]

					clause = "MATCH (b:Book) WHERE b.url =~ '.*"+url_id+"' RETURN ID(b)"
					puts clause.blue.on_red
				end
			end
		rescue Exception => e
			puts e.to_s.red
		end
	end
end