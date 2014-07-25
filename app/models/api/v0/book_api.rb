include BooksGraphHelper
include NotificationHelper
module Api
	module V0
		class BookApi

			def self.create_thumb_request params
				ThumbRequest.create params[:books_api]
			end

			def self.bookmarked_books
				self.recommendations.map do |s|
					s['bookmark_status'] = 1
					s
				end
			end

			def self.get_feed book_id
				feeds = BooksGraphHelper.get_feed book_id
				notifications = NotificationHelper.structure_feed feeds
				notifications
			end

			def self.get_book(id)
				@neo = Neography::Rest.new
				clause = "MATCH (book:Book) WHERE ID(book)="+id.to_s+" RETURN book"
				puts clause.blue.on_red
				book = @neo.execute_query(clause)["data"]
				book
			end

			def self.push_recommendations
				self.recommendations
			end

			def self.get_timeline id
				test_moments = [
					{
						:user => {
							:id => 1,
							:thumb => "assets/profile_pic.jpeg"
						},
						:timestamp => "2 days ago",
						:votes => 23,
						:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
								that he is seeking; that he is unable to find anything, unable to absorb anything because 
								he is only thinking of the thing he is seeking...",
						:moment => "Death broken down into molecular importance."
					},
					{
						:user => {
							:id => 1,
							:thumb => "assets/profile_pic.jpeg"
						},
						:timestamp => "2 days ago",
						:votes => 23,
						:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
								that he is seeking; that he is unable to find anything, unable to absorb anything because 
								he is only thinking of the thing he is seeking...",
						:moment => "Death broken down into molecular importance."
					},
					{
						:user => {
							:id => 1,
							:thumb => "assets/profile_pic.jpeg"
						},
						:timestamp => "2 days ago",
						:votes => 23,
						:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
								that he is seeking; that he is unable to find anything, unable to absorb anything because 
								he is only thinking of the thing he is seeking...",
						:moment => "Death broken down into molecular importance."
					},
					{
						:user => {
							:id => 1,
							:thumb => "assets/profile_pic.jpeg"
						},
						:timestamp => "2 days ago",
						:votes => 23,
						:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
								that he is seeking; that he is unable to find anything, unable to absorb anything because 
								he is only thinking of the thing he is seeking...",
						:moment => "Death broken down into molecular importance."
					},
					{
						:user => {
							:id => 1,
							:thumb => "assets/profile_pic.jpeg"
						},
						:timestamp => "2 days ago",
						:votes => 23,
						:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
								that he is seeking; that he is unable to find anything, unable to absorb anything because 
								he is only thinking of the thing he is seeking...",
						:moment => "Death broken down into molecular importance."
					},
					{
						:user => {
							:id => 1,
							:thumb => "assets/profile_pic.jpeg"
						},
						:timestamp => "2 days ago",
						:votes => 23,
						:quote => "When someone is seeking, it happens quite easily that he only sees the thing 
								that he is seeking; that he is unable to find anything, unable to absorb anything because 
								he is only thinking of the thing he is seeking...",
						:moment => "Death broken down into molecular importance."
					}
				]
				info = {"moments" => test_moments}
			end

			def self.get_popular_books(params, user_id)
				skip_count = params[:skip_count]
				unless skip_count
					skip_count = 0
				end
				@neo = Neography::Rest.new
				clause = "MATCH (book:Book) WITH book OPTIONAL MATCH (book)<-[:MarkAsRead]-(:MarkAsReadNode)<-[m:MarkAsReadAction]-(user:User) WHERE ID(user)="+user_id.to_s+" RETURN book.isbn as isbn, ID(book), book.title, book.author_name, ID(m) SKIP "+(10*skip_count.to_i).to_s+" LIMIT 10"
				puts clause.blue.on_red
				begin
					books =  @neo.execute_query(clause)["data"]
				rescue Exception => e
					puts e.to_s.red
					books = [{:message => "Error in finding books"}]
					# books =  @neo.execute_query(clause)["data"]
				end
				# results = []
				# for book in books
				# 	book = book[0]["data"]
				# 	isbn = book["isbn"].split(",")[0] rescue nil
				# 	thumb = "http://covers.openlibrary.org/b/isbn/"+isbn+"-S.jpg" rescue ""
				# 	book = {
				# 		:title => book["title"],
				# 		:author_name => book["author_name"],
				# 		:thumb => thumb
				# 	}
				# 	results.push book
				# end
				# results
				books
			end
			def self.get_book_details(id, user_id=nil)
				book = BooksGraphHelper.get_details(id, user_id)
				if user_id
					rating = book[1]
					time_index = book[2]
					labels = book[3]
					selected_labels = book[4]
					structured_labels = []
					for label in labels
						if selected_labels.include? label
							json = {"name" => label, "checked" => true}
						else
							json = {"name" => label, "checked" => false}
						end
						structured_labels.push json
					end

					mark_as_read = book[5]
					if mark_as_read.nil?
						mark_as_read = false
					else
						mark_as_read = true
					end

					book = book[0]["data"]
					
				end
				info = {
							:title => book["title"],
							:author_name => book["author_name"],
							:rating => book["gr_rating"].to_f*2,
							:readers_count => book["readers_count"],
							:bookmark_count => book["bookmark_count"],
							:comment_count => book["comment_count"],
							:published_year => book["published_year"],
							:page_count => book["page_count"],
							:summary => book["description"],
							:status => mark_as_read,
							:labels => structured_labels,
							:users => [
								{
									:id => 1,
									:url => "",
									:name => "test user",
									:thumb => "assets/profile_pic.jpeg"
								},
								{
									:id => 2,
									:url => "",
									:name => "test user",
									:thumb => "assets/profile_pic.jpeg"
								},
								{
									:id => 3,
									:url => "",
									:name => "test user",
									:thumb => "assets/profile_pic.jpeg"
								},
								{
									:id => 4,
									:url => "",
									:name => "test user",
									:thumb => "assets/profile_pic.jpeg"
								},
								{
									:id => 5,
									:url => "",
									:name => "test user",
									:thumb => "assets/profile_pic.jpeg"
								},
								{
									:id => 6,
									:url => "",
									:name => "test user",
									:thumb => "assets/profile_pic.jpeg"
								}
							],
							:users_count => 15
						}
				if user_id
					info.merge!(:user_rating => rating, :time_index => time_index)
				end
				info
			end

			def self.recommendations(last_book, filters={}, user_id=nil)
				#FIXME only output isbns
				if filters["reset"]
					$redis.set 'book_ids', ""
					puts "RESET TRUE".red.on_yellow.blink
				end
				book_ids = ($redis.get 'book_ids').split(",")
				
				# puts book_ids.sort
				@neo = Neography::Rest.new
				
				results = []

				specific_list = filters["filter_id"].present?
				trends = filters["trend_id"].present?

				if filters["other_filters"].present?
					book_name = filters["other_filters"]["title"]
					book_id = filters["other_filters"]["id"]
					if book_id.present?
						clause = self.get_books_by_id filters
					elsif book_name.present?
						clause = self.get_books_by_title filters
					else
						clause = self.get_filtered_books filters
					end
				elsif trends
					clause = self.get_trends(filters["trend_id"])
				elsif specific_list
					clause = self.get_specific_lists(filters["filter_id"], user_id)
				else
					clause = self.get_basic_recommendations(filters, last_book)
				end


				puts clause.blue.on_red
				begin
					books = @neo.execute_query(clause)["data"]
				rescue Exception => e
					puts "ERROR "+e.to_s.blue.on_red.blink
					$redis.set 'book_ids', ""
					books = @neo.execute_query(clause)["data"]
				end
				# puts books.length.to_s.red.on_blue
				unless filters["filter_id"].present?
					for book in books
						node_id = book[1].to_s
						book_sent = book_ids.include? node_id
						unless book_sent
							if book_ids.present?
								book_ids = ($redis.get 'book_ids')+","+node_id
							else
								book_ids = node_id
							end
							$redis.set 'book_ids', book_ids
							results.push book
						end
					end
				else
					results = books
				end 
				results
				# books
			end

			def self.detailed_book id
				if id == "1"
					thumb = "assets/books/20.jpeg"
				elsif id == "2"
					thumb = "assets/books/15.jpeg"
				elsif id == "3"
					thumb = "assets/books/11.jpeg"
				elsif id == "4"
					thumb = "assets/books/13.jpeg"
				elsif id == "5"
					thumb = "assets/books/a2.jpeg"
				elsif id == "13"
					thumb = "assets/Siddhartha.jpg"
				end
				_test_book_info(id, thumb)
			end

			def self.tooltip
				info = {
					:id => 1,
					:recommended => 0
				}
			end

			private
			def self.get_trends trend_id
				clause = "MATCH (t:Trending)-[:RelatedBooks]->(b:Book) WHERE ID(t)="+trend_id.to_s+" RETURN b.isbn, ID(b), b.indexed_title"
				clause
			end

			def self.get_specific_lists(filter_id, user_id)
				clause = "MATCH (l:Label), (u:User) WHERE ID(l)="+filter_id.to_s+" AND ID(u)="+user_id.to_s+" WITH u, l MATCH (u)-[:Labelled]->(l)-[:BookmarkedOn]->(:BookmarkNode)-[:BookmarkAction]->(b:Book) RETURN b.isbn, ID(b), b.indexed_title"
				clause
			end

			def self.get_basic_recommendations(filters, last_book)
				clause = "START book = node:node_auto_index(\"indexed_title:"+last_book+"\") MATCH p=(book)-[:Next_book*..5]->(b) WITH last(nodes(p)) as b RETURN b.isbn, ID(b), b.indexed_title"
				clause
			end

			def self.get_books_by_id filters
				book_id = filters["other_filters"]["id"]
				clause = "MATCH(book:Book) WHERE ID(book)="+book_id.to_s+" RETURN book.isbn as isbn, ID(book)"
				clause
			end

			def self.get_books_by_title filters
				book_name = filters["other_filters"]["title"].gsub(" ", "").gsub(":", "")
				author_name = filters["other_filters"]["author_name"].gsub(" ", "").gsub!(":", "") rescue ""
				show_all = filters["other_filters"]["show_all"]
				if show_all
					puts "book_name "+book_name+" show_all ".green
					skip_count = filters["reset_count"]
					clause = "START book=node:node_auto_index(\"indexed_title:"+book_name.downcase+"*\") WITH book, toFloat(book.gr_rating) * toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) as weight RETURN book.isbn as isbn, ID(book), weight ORDER BY weight DESC SKIP "+skip_count.to_s+" LIMIT 10"
				else
					puts "book_name "+book_name+" author_name "+author_name+" ".green
					clause = "START book=node:node_auto_index(\"indexed_title:"+book_name.downcase+"\") WHERE book.indexed_author_name=\""+author_name.downcase+"\" RETURN book.isbn as isbn, ID(book)"
				end
				clause
			end

			def self.get_filtered_books filters
				where_clause = ""
				match_clause = ""
				skip_clause = ""
				book_ids = ($redis.get 'book_ids').split(",")
				random = Random.new.rand(1..100)
				unless filters["reset"]
					if filters["reset_count"]
						skip_clause = "SKIP "+(filters["reset_count"] * 10).to_s+" "
						puts "RESET "+filters["reset_count"].to_s+" FALSE".red.on_yellow.blink
					end
				end
				init_match_clause = "MATCH (book:Book) "
				distinct_clause = "ALL (id in "+book_ids.to_s+" WHERE toInt(id) <> ID(book)) "
				random_clause = "ID(book)%"+random.to_s+"=0 AND rand() > 0.3 "
				with_clause = "WITH book, toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) * toFloat(book.gr_rating) AS total_weight, toFloat(book.gr_ratings_count) * toFloat(book.gr_rating) AS rating_weight "
				return_clause = "RETURN book.isbn as isbn, ID(book)"
				order_clause = ", total_weight, rating_weight ORDER BY rating_weight DESC, total_weight DESC, book.gr_rating DESC "
				limit_clause = " LIMIT 10 "

				if filters["other_filters"]["country"].present?
					where_clause = where_clause + ""
					match_clause = match_clause + ""
				end
				if filters["other_filters"]["readingTime"].present?
					read_time = filters["other_filters"]["readingTime"]
					match_clause = match_clause + ", (rt:ReadTime{name: '"+read_time+"'})<-[:WithReadingTime]-(book) "
					if where_clause.present?
						where_clause = where_clause + " AND book.page_count <> 0 "
					else
						where_clause = where_clause + " book.page_count <> 0 "
					end
				end
				if filters["other_filters"]["timeGroup"].present?
					category = "Era: "+filters["other_filters"]["timeGroup"].gsub(/\(.*?\)/, "").strip
					time_range =  filters["other_filters"]["timeGroup"][/\(.*?\)/]
									.gsub("(","")
									.gsub(")","")
									.split("-")
					match_clause = match_clause + ", (book)-[:Published_in]->(y:Year) "
					clause = " toInt(y.year) > "+time_range[0]+
							" AND toInt(y.year) < "+time_range[1]+" "
					if where_clause.present?
						where_clause = where_clause + " AND"+clause
					else
						where_clause = where_clause + clause
					end
				end
				if filters["other_filters"]["author"].present?
					author_name =  filters["other_filters"]["author"]
					category = "Written by "+ author_name
					match_clause = match_clause + ", (author:Author)-[:Wrote]->(book) "
					clause = " author.name =~ '(?i)"+author_name+"' "
					if where_clause.present?
						where_clause = where_clause + " AND"+clause
					else
						where_clause = where_clause + clause
					end
				end
				if filters["other_filters"]["genre"].present?
					genre = filters["other_filters"]["genre"]
					category = "Genre: "+genre
					match_clause = match_clause + ", (genre:Genre)<-[:Belongs_to]-(book) "
					clause = " genre.name =~ '(?i)"+genre+"' "
					if where_clause.present?
						where_clause = where_clause + " AND"+clause
					else
						where_clause = where_clause + clause
					end
				end

				puts where_clause.present?
				puts match_clause.present?
				if where_clause.present? && match_clause.present?
					clause = init_match_clause+match_clause+"WHERE "+where_clause+with_clause+return_clause+order_clause+skip_clause+limit_clause
				# elsif match_clause.present?
				# 	clause = init_match_clause+match_clause+with_clause+return_clause+order_clause+skip_clause+limit_clause
				# elsif where_clause.present?
				# 	if filters["other_filters"]["show_all"]
				# 		clause = init_match_clause+"WHERE "+where_clause+return_clause+limit_clause
				# 	else
				# 		clause = init_match_clause+"WHERE "+where_clause+return_clause
				# 	end
				else
					category = "Must Reads"
					clause = init_match_clause+"WHERE "+random_clause+with_clause+return_clause+order_clause+skip_clause+limit_clause
				end
				clause
			end

		end
	end
end