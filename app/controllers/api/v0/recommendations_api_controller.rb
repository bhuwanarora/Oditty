module Api
	module V0
		class RecommendationsApiController < ApplicationController
			# include 'Pubnub'
			# skip_before_filter :verify_authenticity_token, :only => [:recommendations]

			def initiate_push
				# init
				# subscribe
				# publish
			end

			def random_books
				@neo = Neography::Rest.new
				clause = "MATCH (book:ActiveBook) RETURN ID(book), book.isbn LIMIt 15"
				puts clause.blue.on_red
				info = @neo.execute_query(clause)["data"]
				render :json => info, :status => 200
			end


			def grid
				@neo = Neography::Rest.new
				last_grid_id = $redis.get 'last_grid'
				unless last_grid_id
					last_grid_id = Constants::BestGrid
					$redis.set 'last_grid', last_grid_id
					clause = "MATCH (bg:BookGrid) WHERE ID(bg)="+last_grid_id.to_s+" WITH bg "
				else
					clause = "MATCH (grid:BookGrid)-[:NextGrid]->(bg) WHERE ID(grid)="+last_grid_id.to_s+" WITH bg "
				end
				clause = clause + "OPTIONAL MATCH (bg)-[:RelatedBooks]->(book:Book) RETURN bg.name, book.isbn, ID(book), ID(bg), book.external_thumb"
				puts clause.blue.on_red
				info = @neo.execute_query(clause)["data"]
				begin
					$redis.set 'last_grid', info[0][3]
				rescue Exception => e
					$redis.set 'last_grid', Constants::BestGrid
				end
				render :json => info, :status => 200
			end

			def filters
				filters_book = Filter.where(:filter_type => "BOOK")
								.order("priority DESC")
								.select("id, name, priority")
								.as_json
								.first(5)
				filter_author = Filter.where(:filter_type => "AUTHOR")
								.order(:priority)
								.select("id, name, priority")
								.as_json
				filter_reader = Filter.where(:filter_type => "READER")
								.order(:priority)
								.select("id, name, priority")
								.as_json
				render :json => {:filters => {
									"book" => filters_book, 
									"author" => filter_author,
									"reader" => filter_reader
								}}, :status => 200
			end

			def push_recommendations
				@neo = Neography::Rest.new
				clause = "MATCH (b:Book) RETURN b.isbn, ID(b), b.indexed_title LIMIT 20"
				puts clause.blue.on_red
				info = @neo.execute_query(clause)["data"]
				render :json => info, :status => 200
			end

			def recommendations
				@neo = Neography::Rest.new
				filter_type = (JSON.parse params[:q])["filter_type"]
				filters = JSON.parse(params[:q])
				unless session[:user_id].present?
					user_id = params[:id]
				end
				puts "recommendations session #{session[:user_id]} user_id #{params[:id]}"
				if filter_type == "BOOK"
					reading_time_filter = filters["other_filters"][Constants::Time].present?
					clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" RETURN "
					if reading_time_filter
						if filters["reset"]
							# session.delete(:last_filter_book)
						end
						clause = clause + "u.last_filter_book"
						# last_book = session[:last_filter_book]
					else
						# last_book = session[:last_book]
						clause = clause + "u.last_book"
					end
					last_book = @neo.execute_query(clause)["data"][0][0]
					# puts "get_last_book #{last_book.to_s.red}"
					books = BookApi.recommendations(last_book, filters, session)

					basic_recommendations = !filters["other_filters"].present?
					non_zero_result = books.present? && books.length > 0
					if non_zero_result
						if basic_recommendations
							# session[:last_book] = books[books.length-1][1]
							# session.delete(:last_filter_book)

							clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" SET u.last_book="+books[books.length-1][1].to_s+" REMOVE u.last_filter_book"
							puts clause.blue.on_red
							@neo.execute_query clause
						elsif reading_time_filter
							# session[:last_filter_book] = books[books.length-1][1]

							clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" SET u.last_filter_book="+books[books.length-1][1].to_s
							puts clause.blue.on_red
							@neo.execute_query clause
						end
					end
					
					recommendations =  {:books => books}
				elsif filter_type == Constants::Author
					authors = AuthorApi.recommendations
					recommendations = {:authors => authors}
				else
					readers = ReaderApi.recommendations
					recommendations = {:readers => readers}
				end
				# last_book = $redis.get 'last_book'
				# puts "set_last_book #{session[:last_book].to_s.red}"
				render :json => {:recommendations => recommendations}, :status => 200
			end
		end
	end
end