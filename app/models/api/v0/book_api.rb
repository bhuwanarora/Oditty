module Api
	module V0
		class BookApi
			def self.map_fb_book params
				facebook_id = params["facebook_id"]
				Api::V0::FacebookApi.map params, facebook_id
			end

			def self.create_thumb_request(params, user_id)
				BooksGraphHelper.create_thumb_request(params, user_id)
			end

			def self.bookmarked_books
				self.recommendations.map do |s|
					s['bookmark_status'] = 1
					s
				end
			end

			def self.get_feed book_id
				feeds = Book::BookFeed.new(book_id).get_feed.execute
				notifications = FeedStructure.new(feeds).execute
				notifications
			end

			def self.get_book(id)
				@neo = Neography::Rest.new
				clause = "MATCH (book:Book) WHERE ID(book)="+id.to_s+" RETURN book"
				book = @neo.execute_query(clause)["data"]
				book
			end

			def self.get_book_from_fb_likes user_id, skip_count
				output = (User.new(user_id).get_fb_books(skip_count)).execute
				output
			end

			def self.push_recommendations
				self.recommendations
			end

			def self.get_interesting_info book_id
				output = Book.new(book_id).get_interesting_info.execute[0]
				info_list = output["info"]
				filtered_info = []
				filtered_info = info_list.map{|element| {"id" => element["id"], "labels" => element["labels"], "data" => element["info"]["data"]}}
				filtered_output = output
				filtered_output["info"] = filtered_info
				filtered_output
			end

			# def self.get_timeline id
			# 	test_moments = [
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		},
			# 		{
			# 			:user => {
			# 				:id => 1,
			# 				:thumb => "assets/profile_pic.jpeg"
			# 			},
			# 			:timestamp => "2 days ago",
			# 			:votes => 23,
			# 			:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
			# 					that he is seeking; that he is unable to find anything, unable to absorb anything because 
			# 					he is only thinking of the thing he is seeking...",
			# 			:moment => "Death broken down into molecular importance."
			# 		}
			# 	]
			# 	info = {"moments" => test_moments}
			# end

			def self.get_popular_books(params, user_id)
				if params["q"].present?
					params = JSON.parse params["q"]
				end
				skip_count = (params.nil? || params["skip_count"].nil?) ? 0 : params["skip_count"]
				info = (User::Suggest::BookSuggestion.get_popular_books skip_count, user_id).execute
				info
			end


			def self.get_basic_feed_info(id)
				book = Book.new(id).get_display_info.execute[0]
				book
			end

			def self.get_primary_info id
				book = Book.new(id).get_primary_info.execute[0]
				book
			end

			def self.get_social_details
				if user_id.present?
					book = UsersBook.new(id, user_id).get_basic_details.execute[0]
				else
					book = {}
				end
				if user_id && book
					structured_labels = []
					friends_who_have_read = []
					if book["friends_id"].present?
						book["friends_id"].each do |id, index|
							friends_who_have_read.push({:id => id, :thumb => book["friends_thumb"][index]})
						end
					end

					book.merge!(:friends => friends_who_have_read)
				end
			end

			def self.get_book_details(id, user_id=nil)
				book = Book.new(id).get_display_info.execute[0]
				book
			end

			def self.get_book_info_by_isbn isbn_string
				output = []
				isbn = BookHelper.parse_isbn_string isbn_string.to_s
				isbn_list = isbn.map{|key,value| (value)}.delete_if(&:empty?)
				if isbn_list.present?
					clause = Book.get_books_by_isbn(isbn_list) +  Book.return_group(Book.basic_info)
					output = clause.execute
				end
				output[0]
			end

		end
	end
end