module Api
	module V0
		class RecommendationsApiController < ApplicationController
			# include 'Pubnub'

			def initiate_push
				# init
				# subscribe
				# publish
			end

			def grid
				@neo = Neography::Rest.new
				clause = "MATCH (bg:BookGrid) WHERE bg.status = 1 WITH bg LIMIT 1 OPTIONAL MATCH (bg)-[:RelatedBooks]->(book:Book) RETURN bg.name, book.isbn, ID(book), ID(bg), book.external_thumb"
				puts clause.blue.on_red
				info = @neo.execute_query(clause)["data"]
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
				filter_type = (JSON.parse params[:q])["filter_type"]
				filters = JSON.parse(params[:q])
				if filter_type == "BOOK"
					reading_time_filter = filters["other_filters"]["readingTime"].present?
					if reading_time_filter
						if filters["reset"]
							$redis.set 'last_filter_book', nil
						end
						last_book = $redis.get 'last_filter_book'
					else
						last_book = $redis.get 'last_book'
					end
					books = BookApi.recommendations(last_book, filters, session[:user_id])

					basic_recommendations = !filters["other_filters"].present?
					non_zero_result = books.present? && books.length > 0
					if non_zero_result
						if basic_recommendations
							$redis.set 'last_book', books[books.length-1][1]
							$redis.set 'last_filter_book', nil
						elsif reading_time_filter
							$redis.set 'last_filter_book', books[books.length-1][1]
						end
					end
					
					recommendations =  {:books => books}
				elsif filter_type == "AUTHOR"
					authors = AuthorApi.recommendations
					recommendations = {:authors => authors}
				else
					readers = ReaderApi.recommendations
					recommendations = {:readers => readers}
				end
				last_book = $redis.get 'last_book'
				puts last_book.to_s.blue.on_red
				render :json => {:recommendations => recommendations}, :status => 200
			end
		end
	end
end