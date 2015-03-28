module Api
	module V0
		class RoomApi 
			def self.get_books_from_public_shelves user_id
				books = User::Room.new(user_id).get_books_from_public_shelves.execute
				self.set_dominant_color books
			end

			def self.get_visited_books user_id 
				books = User::Room.new(user_id).get_visited_books.execute
				self.set_dominant_color books
			end

			def self.get_articles_from_public_shelves
				books = User::Room.new(user_id).get_books_from_public_shelves.execute
			end

			def self.get_visited_articles
				articles = User::Room.new(user_id).get_visited_articles.execute
			end

			def self.set_dominant_color
				threads = [] 
				books.each do |book|
					threads << Thread.new(book){|book| book["dominant_color"] = Book::Photo.get_dominant_color(book["isbn"])}
				end
				threads.each{|thread| thread.join}
				labels = books.each_with_object(Hash.new(0))  {|book,labels| if (labels[book["shelf"]].length <=4 or labels[book["shelf"]].nil?) then (labels[book["shelf"]] ||= [] ) << book end }
				labels
			end
		end
	end
end